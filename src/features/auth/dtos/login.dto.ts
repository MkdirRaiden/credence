// src/features/auth/dtos/login.dto.ts
import { IsEmail, IsString, MinLength, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrimTransform } from '@/common/decorators';
import { AUTH_VALIDATION } from '@/features/auth/constants';

export class LoginDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'User email (required if username is not provided)',
  })
  @ValidateIf((o: LoginDto) => !o.username)
  @IsEmail(
    {},
    { message: 'Invalid email format (required if username not provided)' },
  )
  @TrimTransform
  email?: string;

  @ApiPropertyOptional({
    example: 'johndoe',
    description: 'Username (required if email is not provided)',
  })
  @ValidateIf((o: LoginDto) => !o.email)
  @IsString({ message: 'Username must be a string' })
  @MinLength(AUTH_VALIDATION.LOGIN_IDENTIFIER_MIN_LENGTH, {
    message: 'Username cannot be empty',
  })
  @TrimTransform
  username?: string;

  @ApiProperty({
    example: 'StrongPassw0rd!',
    description: 'User password',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(AUTH_VALIDATION.LOGIN_IDENTIFIER_MIN_LENGTH, {
    message: 'Password cannot be empty',
  })
  @TrimTransform
  password: string;
}
