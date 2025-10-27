import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;
}
