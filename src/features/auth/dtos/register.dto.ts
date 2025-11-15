// src/features/auth/dtos/register.dto.ts
import { TrimTransform } from '@/common/decorators';
import { IsString, MinLength, Matches } from 'class-validator';
import { AUTH_VALIDATION } from '@/features/auth/constants';
import { CreateUserDto } from '@/features/users/dtos';

/**
 * DTO for user registration
 * Extends CreateUserDto and adds password validation
 */
export class RegisterDto extends CreateUserDto {
  @IsString()
  @MinLength(AUTH_VALIDATION.PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${AUTH_VALIDATION.PASSWORD_MIN_LENGTH} characters long`,
  })
  @Matches(AUTH_VALIDATION.PASSWORD_PATTERN, {
    message:
      'Password must contain at least 1 uppercase letter, 1 number, and 1 special character',
  })
  @TrimTransform
  password: string;
}
