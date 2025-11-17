// src/features/auth/dtos/requests/refresh-token.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TrimTransform } from '@/common/decorators';
import { AUTH_VALIDATION } from '@/features/auth/constants';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token issued during login or registration',
    minLength: AUTH_VALIDATION.TOKEN_MIN_LENGTH,
  })
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token cannot be empty' })
  @MinLength(AUTH_VALIDATION.TOKEN_MIN_LENGTH, {
    message: 'Invalid refresh token format',
  })
  @TrimTransform
  refreshToken: string;
}
