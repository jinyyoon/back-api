import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}
