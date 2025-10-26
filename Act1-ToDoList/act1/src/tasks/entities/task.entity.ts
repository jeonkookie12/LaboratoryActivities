import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Activity1')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_name' })
  title: string;

  @Column({ default: false })
  completed: boolean;
}
