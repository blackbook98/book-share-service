import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  book_id: string;

  @Column({ type: 'json' })
  volume_info: any;

  @Column()
  description: string;

  @Column()
  list: string;
}
