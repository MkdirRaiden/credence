// src/features/auth/dtos/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';
import { TrimTransform } from '@/common/decorators';

/**
 * Email/Password login request
 * Phase 1: Email/Password only
 * Phase 2: Will add phone/OTP variant
 */
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @TrimTransform
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(1, { message: 'Password cannot be empty' })
  @TrimTransform
  password: string;
}
