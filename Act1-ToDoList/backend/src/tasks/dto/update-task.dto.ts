import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

/**
 * Data Transfer Object for updating an existing task
 * All fields are optional, allowing partial updates
 * Extends CreateTaskDto to inherit its structure
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  /** Optional task title to update */
  title?: string;
  /** Optional completion status to update */
  completed?: boolean;
}
