import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';

/**
 * Data Transfer Object for user registration
 * Defines the structure of data required to register a new user
 * Includes strict validation rules for security
 */
export class RegisterDto {
  /**
   * Username - required
   * Must start with a letter and contain only letters, numbers, underscores, or hyphens
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z][a-zA-Z0-9_-]*$/, { message: 'Username must start with a letter and contain only letters, numbers, underscores, or hyphens.' })
  username: string;

  /**
   * Password - required
   * Must be at least 8 characters and include:
   * - At least one lowercase letter
   * - At least one uppercase letter
   * - At least one special character
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])/, { message: 'Password must have at least one lowercase letter.' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must have at least one uppercase letter.' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: 'Password must have at least one special character.' })
  password: string;
}