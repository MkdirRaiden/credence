// src/features/users/dtos/update-user.dto.ts
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { TrimTransform } from '@/common/decorators';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @TrimTransform
  name?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
