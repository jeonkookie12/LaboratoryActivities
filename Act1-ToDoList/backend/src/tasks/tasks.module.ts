// tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';

/**
 * Tasks module
 * Configures the tasks feature module with its dependencies
 */
@Module({
  // Register the Task entity with TypeORM for this module
  imports: [TypeOrmModule.forFeature([Task])], 
  // Register the TasksService as a provider
  providers: [TasksService],
  // Register the TasksController to handle HTTP requests
  controllers: [TasksController],
  // Export TypeOrmModule so other modules can use the Task repository
  exports: [TypeOrmModule], 
})
export class TasksModule {}
