// src/features/users/dtos/create-user.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsUrl,
} from 'class-validator';
import { TrimTransform } from '@/common/decorators';
import { USER_VALIDATION } from '@/features/users/users.config';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @TrimTransform
  email: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(USER_VALIDATION.USERNAME_MIN_LENGTH, {
    message: `Username must be at least ${USER_VALIDATION.USERNAME_MIN_LENGTH} characters`,
  })
  @MaxLength(USER_VALIDATION.USERNAME_MAX_LENGTH, {
    message: `Username must be at most ${USER_VALIDATION.USERNAME_MAX_LENGTH} characters`,
  })
  @Matches(USER_VALIDATION.USERNAME_REGEX, {
    message:
      'Username can only contain letters, numbers, underscores, and hyphens',
  })
  @TrimTransform
  username?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(USER_VALIDATION.PHONE_REGEX, {
    message: 'Phone must be in valid international format',
  })
  @TrimTransform
  phone?: string;

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
