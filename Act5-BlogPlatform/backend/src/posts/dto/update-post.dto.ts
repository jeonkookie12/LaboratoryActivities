import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

/**
 * Data Transfer Object for updating an existing blog post
 * All fields are optional, allowing partial updates
 * Extends CreatePostDto to inherit its structure
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {}