import { IsString, MinLength, Matches } from 'class-validator';

export class SetPrivatePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @MinLength(6)
  confirm: string;
}