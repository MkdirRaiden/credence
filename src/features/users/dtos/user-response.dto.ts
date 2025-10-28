// src/users/dtos/user-response.dto.ts
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UserResponseDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  referralCode?: string;
}
