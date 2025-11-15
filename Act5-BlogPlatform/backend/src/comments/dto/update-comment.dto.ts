import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';

/**
 * Data Transfer Object for updating an existing comment
 * All fields are optional, allowing partial updates
 * Extends CreateCommentDto to inherit its structure
 */
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}