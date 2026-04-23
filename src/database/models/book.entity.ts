import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { List } from './lists.entity';
import { Review } from './review.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  book_id: string;

  @Column()
  name: string;

  @Column({ type: 'json' })
  volume_info: any;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => List, (list) => list.book)
  lists: List[];

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
