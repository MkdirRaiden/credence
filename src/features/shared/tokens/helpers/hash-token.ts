// src/features/shared/tokens/helpers/hash-verify-token.ts
import * as crypto from 'crypto';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
