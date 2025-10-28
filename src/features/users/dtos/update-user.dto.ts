// src/features/users/dtos/update-user.dto.ts
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  // Only safe fields to update
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
