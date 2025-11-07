import { IsString } from 'class-validator';

export class ValidatePrivatePasswordDto {
  @IsString()
  password: string;
}