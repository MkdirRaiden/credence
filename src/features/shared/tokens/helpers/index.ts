// src/features/shared/tokens/helpers/index.ts
import * as crypto from 'crypto';

export interface RefreshTokenRecord {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  isRevoked: boolean;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Returns true if the token is valid for the given userId, false otherwise.
 * No HTTP exceptions are thrown here; callers decide how to react.
 */
export function isRefreshTokenValid(
  token: RefreshTokenRecord | null,
  userId: string,
): boolean {
  if (!token || token.userId !== userId || token.isRevoked) return false;

  if (token.expiresAt < new Date()) return false;

  return true;
}
