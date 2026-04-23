import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/models/user.entity';
import { List } from '../database/models/lists.entity';
import { Book } from '../database/models/book.entity';
import { Review } from '../database/models/review.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findUser(data: Partial<User>): Promise<any> {
    try {
      let userdata = await this.userRepository.findOne({
        where: { username: data.username },
      });

      if (userdata) {
        return userdata;
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error in finding user', error);
      return null;
    }
  }

  async createUser(data: Partial<User>): Promise<any> {
    try {
      let { password: pass } = data;
      let encrypted_password = await bcrypt.hash(pass, 10);

      //TODO: Add BE Validations
      let userdata = this.userRepository.create({
        ...data,
        password: encrypted_password,
      });
      return await this.userRepository.save(userdata);
    } catch (error) {
      console.error('Error in creating user', error);
      return null;
    }
  }

  async saveLists(data: any): Promise<any> {
    try {
      await this.bookRepository.upsert(
        {
          book_id: data?.book?.id,
          name: data?.book?.volumeInfo?.title,
          volume_info: data?.book?.volumeInfo,
          description: data?.book?.volumeInfo?.description,
        },
        ['book_id'],
      );

      const book = await this.bookRepository.findOne({
        where: { book_id: data?.book?.id },
      });

      return await this.listRepository.upsert(
        {
          book_id: book?.id,
          list: data?.listName,
          user_id: data?.user_id,
        },
        ['book_id', 'user_id'],
      );
    } catch (error) {
      console.error('Error in upserting list', error);
      return 'error';
    }
  }

  async getLists(UserId: any): Promise<any> {
    try {
      return await this.listRepository.find({
        where: { user_id: UserId },
        relations: ['book'],
      });
    } catch (error) {
      console.error('Error in fetching lists', error);
      return 'error';
    }
  }

  async deleteList(id: string, user_id: string): Promise<any> {
    try {
      const book = await this.bookRepository.findOne({
        where: { book_id: id },
      });

      console.log('book', book);
      console.log('user_id', user_id);

      if (!book) return 'error';

      return await this.listRepository.delete({ book_id: book.id, user_id });
    } catch (error) {
      console.error('Error in deleting list', error);
      return 'error';
    }
  }

  async saveReview(data: {
    userId: string;
    bookId: string;
    rating: number;
    content?: string;
  }): Promise<any> {
    try {
      const book = await this.bookRepository.findOne({
        where: { book_id: data.bookId },
      });

      if (!book) return 'error';

      return await this.reviewRepository.upsert(
        {
          userId: data.userId,
          bookId: book.id,
          rating: data.rating,
          content: data.content,
        },
        ['userId', 'bookId'],
      );
    } catch (error) {
      console.error('Error in saving review', error);
      return 'error';
    }
  }

  async getReviewsByBook(bookId: string): Promise<any> {
    try {
      const book = await this.bookRepository.findOne({
        where: { book_id: bookId },
      });

      if (!book) return [];

      const reviews = await this.reviewRepository.find({
        where: { bookId: book.id },
        relations: ['user'],
      });

      return reviews.map((review) => ({
        userId: review.userId,
        username: review.user.username,
        rating: review.rating,
        content: review.content,
      }));
    } catch (error) {
      console.error('Error in fetching reviews', error);
      return 'error';
    }
  }

  async getReviewsByUser(userId: string): Promise<any> {
    try {
      return await this.reviewRepository.find({
        where: { userId },
        relations: ['book'],
      });
    } catch (error) {
      console.error('Error in fetching reviews', error);
      return 'error';
    }
  }
}
