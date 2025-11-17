// src/features/auth/dtos/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { TrimTransform } from '@/common/decorators';
import { IsString, MinLength, Matches } from 'class-validator';
import { AUTH_VALIDATION } from '@/features/auth/constants';
import { CreateUserDto } from '@/features/users/dtos';

export class RegisterDto extends CreateUserDto {
  @ApiProperty({
    example: 'StrongPassw0rd!',
    description:
      'Password with at least 1 uppercase letter, 1 number, and 1 special character',
    minLength: AUTH_VALIDATION.PASSWORD_MIN_LENGTH,
  })
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
