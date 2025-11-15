import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for creating a new blog post
 * Defines the structure of data required to create a post
 * Includes validation decorators to ensure data integrity
 */
export class CreatePostDto {
  /**
   * Post title - required
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Post body/content - required
   */
  @IsString()
  @IsNotEmpty()
  body: string;
}