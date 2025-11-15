import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for user login
 * Defines the structure of data required to authenticate a user
 */
export class LoginDto {
  /**
   * Username - required
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * Password - required
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}