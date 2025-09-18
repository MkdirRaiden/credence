// src/users/dtos/user-response.dto.ts
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;

  createdAt: Date;
}
