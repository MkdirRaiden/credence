// src/features/auth/dtos/login.dto.ts
import { IsEmail, IsString, MinLength, ValidateIf } from 'class-validator';
import { TrimTransform } from '@/common/decorators';
import { AUTH_VALIDATION } from '@/features/auth/constants';

/**
 * Email/Password or Username/Password login request
 * Users can login with EITHER email OR username + password
 */
export class LoginDto {
  @ValidateIf((o: LoginDto) => !o.username)
  @IsEmail(
    {},
    { message: 'Invalid email format (required if username not provided)' },
  )
  @TrimTransform
  email?: string;

  @ValidateIf((o: LoginDto) => !o.email)
  @IsString({ message: 'Username must be a string' })
  @MinLength(AUTH_VALIDATION.LOGIN_IDENTIFIER_MIN_LENGTH, {
    message: 'Username cannot be empty',
  })
  @TrimTransform
  username?: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(AUTH_VALIDATION.LOGIN_IDENTIFIER_MIN_LENGTH, {
    message: 'Password cannot be empty',
  })
  @TrimTransform
  password: string;
}
