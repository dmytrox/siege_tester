
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("records")
export class Records {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  tag: string;

  @Column()
  description: string;
}