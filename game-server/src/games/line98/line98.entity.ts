import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Line98Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  boardState: string; 
}
