import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for creating a new comment
 * Defines the structure of data required to create a comment
 * Includes validation decorators to ensure data integrity
 */
export class CreateCommentDto {
  /**
   * Comment body/content - required
   * Maximum length: 250 characters
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  body: string;
}