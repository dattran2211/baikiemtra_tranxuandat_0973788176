import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CaroMatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  playerX: string; // socket id or user identifier

  @Column()
  playerO: string; // socket id or user identifier

  @Column({ type: 'varchar', nullable: true })
  winner: string | null; // "X", "O", hoặc "draw"

  @Column('text')
  moves: string; // JSON.stringify([{x:0,y:0,player:"X"}])
}
