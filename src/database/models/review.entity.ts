import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('reviews')
@Unique(['userId', 'bookId'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })
  book: Book;

  @Column('uuid')
  bookId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
