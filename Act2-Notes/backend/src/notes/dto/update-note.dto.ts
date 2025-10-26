import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @MaxLength(80, { message: 'Title must be at most 80 characters' })
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  pinned?: boolean;

  @IsBoolean()
  @IsOptional()
  is_private?: boolean;
}
