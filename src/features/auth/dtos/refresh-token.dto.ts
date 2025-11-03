// src/features/auth/dtos/requests/refresh-token.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { TrimTransform } from '@/common/decorators';

/**
 * Refresh token request
 * Client sends refresh token to get new access token
 */
export class RefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token cannot be empty' })
  @TrimTransform
  refreshToken: string;
}
