import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

/**
 * Tasks controller
 * Handles all HTTP requests related to task management
 * All endpoints are prefixed with '/tasks'
 */
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * GET /tasks
   * Retrieves all tasks from the database
   * @returns {Promise<Task[]>} Array of all tasks
   */
  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  /**
   * GET /tasks/:id
   * Retrieves a single task by its ID
   * @param {string} id - The task ID from the URL parameter
   * @returns {Promise<Task>} The task with the specified ID
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(+id);
  }

  /**
   * POST /tasks
   * Creates a new task with the provided title
   * @param {string} title - The task title from the request body
   * @returns {Promise<Task>} The newly created task
   */
  @Post()
  create(@Body('title') title: string): Promise<Task> {
    return this.tasksService.create(title);
  }

  /**
   * PATCH /tasks/:id
   * Updates an existing task with partial data
   * @param {string} id - The task ID from the URL parameter
   * @param {Partial<Task>} update - Partial task data to update
   * @returns {Promise<Task>} The updated task
   */
  @Patch(':id')
  update(@Param('id') id: string, 
  @Body() update: Partial<Task>
  ): Promise<Task> {
    return this.tasksService.update(+id, update);
  }

  /**
   * DELETE /tasks/:id
   * Deletes a task by its ID
   * @param {string} id - The task ID from the URL parameter
   * @returns {Promise<void>} Promise that resolves when the task is deleted
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(+id);
  }
}
