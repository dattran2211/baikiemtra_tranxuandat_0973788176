import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum Status {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'text', // ✅ SQLite hỗ trợ
    default: Status.TODO,
  })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;
}
