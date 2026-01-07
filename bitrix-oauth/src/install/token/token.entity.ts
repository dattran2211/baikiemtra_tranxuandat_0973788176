import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column({ type: 'int' })
  expires_in: number;

  @Column()
  member_id: string;

  @Column({ type: 'bigint' })
  created_at: number;
}
