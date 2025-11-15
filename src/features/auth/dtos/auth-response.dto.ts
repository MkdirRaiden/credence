// src/features/auth/dtos/auth-response.dto.ts
import { UserResponseDto } from '@/common/dtos';

/**
 * DTO for successful authentication response
 * Returned on register, login, and refresh endpoints
 */
export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType?: string;
  user?: UserResponseDto;
}
