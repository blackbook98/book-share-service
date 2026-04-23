import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { List } from './lists.entity';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
