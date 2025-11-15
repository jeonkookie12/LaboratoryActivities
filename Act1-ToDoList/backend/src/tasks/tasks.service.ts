import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

/**
 * Tasks service
 * Contains all business logic for task management operations
 */
@Injectable()
export class TasksService {
  constructor(
    // Inject the TypeORM repository for Task entity
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  /**
   * Retrieves all tasks from the database
   * @returns {Promise<Task[]>} Array of all tasks
   */
  findAll(): Promise<Task[]> {
    return this.taskRepo.find();
  }

  /**
   * Retrieves a single task by its ID
   * @param {number} id - The task ID
   * @returns {Promise<Task>} The task with the specified ID
   * @throws {NotFoundException} If the task is not found
   */
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  /**
   * Creates a new task with the provided title
   * New tasks are created with completed status set to false
   * @param {string} title - The task title
   * @returns {Promise<Task>} The newly created task
   */
  async create(title: string): Promise<Task> {
    const task = this.taskRepo.create({ title, completed: false });
    return this.taskRepo.save(task);
  }

  /**
   * Updates an existing task with partial data
   * @param {number} id - The task ID to update
   * @param {Partial<Task>} update - Partial task data to update
   * @returns {Promise<Task>} The updated task
   */
  async update(id: number, update: Partial<Task>): Promise<Task> {
    await this.taskRepo.update(id, update);
    return this.findOne(id); // Retrieve and return the updated task
  }

  /**
   * Deletes a task by its ID
   * @param {number} id - The task ID to delete
   * @returns {Promise<void>} Promise that resolves when the task is deleted
   * @throws {NotFoundException} If the task is not found
   */
  async remove(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
