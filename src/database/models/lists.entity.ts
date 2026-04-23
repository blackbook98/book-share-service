import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Book } from './book.entity';

@Unique(['book_id', 'user_id'])
@Entity('lists')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column()
  list: string;

  @Column()
  book_id: string;

  @ManyToOne(() => Book, (book) => book.lists)
  @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
  book: Book;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
