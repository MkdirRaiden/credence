// src/features/auth/dtos/requests/refresh-token.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { TrimTransform } from '@/common/decorators';
import { AUTH_VALIDATION } from '@/features/auth/constants';

/**
 * Refresh token request
 * Client sends refresh token to get new access token
 */
export class RefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token cannot be empty' })
  @MinLength(AUTH_VALIDATION.TOKEN_MIN_LENGTH, {
    message: 'Invalid refresh token format',
  })
  @TrimTransform
  refreshToken: string;
}
