import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MaxLength(80, { message: 'Title must be at most 80 characters' })
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsBoolean()
  @IsOptional()
  pinned: boolean;

  @IsBoolean()
  is_private: boolean;
}