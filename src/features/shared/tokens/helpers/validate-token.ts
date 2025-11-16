// src/features/shared/tokens/helpers/validate-refresh-token.ts
import { UnauthorizedException } from '@nestjs/common';

export interface RefreshTokenRecord {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  isRevoked: boolean;
}

export function validateRefreshToken(
  token: RefreshTokenRecord | null,
  userId: string,
): void {
  if (!token || token.userId !== userId || token.isRevoked) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  if (token.expiresAt < new Date()) {
    throw new UnauthorizedException('Invalid refresh token');
  }
}
