import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.taskRepo.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(title: string): Promise<Task> {
    const task = this.taskRepo.create({ title, completed: false });
    return this.taskRepo.save(task);
  }

  async update(id: number, update: Partial<Task>): Promise<Task> {
    await this.taskRepo.update(id, update);
    return this.findOne(id); 
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
