import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Task entity
 * Represents a task in the database
 * Maps to the 'Activity1' table in MySQL
 */
@Entity('Activity1')
export class Task {
  /**
   * Primary key - auto-generated unique identifier for each task
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Task title/name
   * Maps to the 'task_name' column in the database
   */
  @Column({ name: 'task_name' })
  title: string;

  /**
   * Completion status of the task
   * Defaults to false (not completed) when a new task is created
   */
  @Column({ default: false })
  completed: boolean;
}
