// src/features/users/dtos/update-user.dto.ts
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { TrimTransform } from '@/common/decorators';
import { USER_VALIDATION } from '@/features/users/users.config';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(USER_VALIDATION.NAME_MIN_LENGTH)
  @MaxLength(USER_VALIDATION.NAME_MAX_LENGTH)
  @TrimTransform
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;
}
