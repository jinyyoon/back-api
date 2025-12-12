import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

export class CreateQnaDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  inputId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  hp?: string;

  @IsOptional()
  @IsString()
  contents?: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsString()
  answerYN?: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  delYN?: string;
}
