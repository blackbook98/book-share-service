import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../database/models/user.entity';
import { List } from '../database/models/lists.entity';
import { Review } from '../database/models/review.entity';
import { Recommendation } from '../database/models/recommendations.entity';

@Injectable()
export class RecommenderService {
  private readonly logger = new Logger(RecommenderService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(List)
    private readonly listRepo: Repository<List>,
    @InjectRepository(Recommendation)
    private readonly recommendationRepo: Repository<Recommendation>,
  ) {}

  async computeAllRecommendations() {
    const eligibleUsers = await this.getEligibleUsers();
    if (eligibleUsers.length === 0) {
      console.log('No eligible users found for recommendations.');
      return;
    }

    for (const user of eligibleUsers) {
      try {
        await this.computeForUser(user.id);
      } catch (error) {
        this.logger.error(`Failed for user ${user.id}:`, error);
        continue;
      }
    }
  }

  async getEligibleUsers(): Promise<User[]> {
    const rows = await this.listRepo
      .createQueryBuilder('list')
      .select('list.user_id', 'userId')
      .innerJoin(
        Review,
        'review',
        'review.userId = list.user_id AND review.bookId = list.book_id',
      )
      .innerJoin(User, 'user', 'user.id = list.user_id')
      .where('user.username != :admin', { admin: 'admin' })
      .groupBy('list.user_id')
      .having('COUNT(*) >= 3')
      .getRawMany<{ userId: string }>();

    console.log('rows', rows);

    const userIds = rows.map((r) => r.userId);
    if (userIds.length === 0) return [];
    return this.userRepo.findBy({ id: In(userIds) });
  }

  async computeForUser(userId: string) {
    const finishedBooks = await this.getFinishedBooks(userId);
    if (finishedBooks.length < 3) return;

    // Get all book IDs already in user's lists (any list)
    const allUserLists = await this.listRepo.find({
      where: { user_id: userId },
      relations: ['book'],
    });
    const alreadyHaveIds = allUserLists.map((l) => l.book.book_id);

    const recommendations = await this.callPythonRecommender(
      finishedBooks,
      alreadyHaveIds,
    );

    await this.saveRecommendations(userId, recommendations);

    return 'Success';
  }

  async getFinishedBooks(userId: string) {
    const items = await this.listRepo
      .createQueryBuilder('list')
      .innerJoinAndSelect('list.book', 'book')
      .leftJoinAndSelect('book.reviews', 'review', 'review.userId = :userId', {
        userId,
      })
      .where('list.user_id = :userId', { userId })
      .andWhere('list.list = :list', { list: 'finished' })
      .andWhere('review.id IS NOT NULL')
      .getMany();

    return items.map((item) => ({
      title: item.book.name,
      authors: item.book.volume_info?.authors || [],
      categories: item.book.volume_info?.categories || [],
      description:
        item.book.description || item.book.volume_info?.description || '',
      rating: item.book.reviews?.[0]?.rating ?? 3,
    }));
  }

  async callPythonRecommender(finishedBooks: any[], alreadyHaveIds: string[]) {
    const baseUrl = process.env.RECOMMENDER_SERVICE_URL;
    if (!baseUrl) throw new Error('RECOMMENDER_SERVICE_URL is not configured');

    const response = await fetch(`${baseUrl}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        books: finishedBooks,
        already_have_ids: alreadyHaveIds,
        top_n: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Recommender service responded with ${response.status}`);
    }

    const data = await response.json();
    return data.recommendations;
  }

  async getRecommendationsForUser(userId: string) {
    const row = await this.recommendationRepo.findOneBy({ user_id: userId });
    if (!row) return { books: [], computed_at: null };
    return { books: row.books, computed_at: row.computed_at };
  }

  async saveRecommendations(userId: string, recommendations: any[]) {
    await this.recommendationRepo.upsert(
      { user_id: userId, books: recommendations, computed_at: new Date() },
      { conflictPaths: ['user_id'] },
    );
  }
}
