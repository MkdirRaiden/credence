// __tests__/unit/features/refresh-tokens/refresh-token.helpers.spec.ts
import { UnauthorizedException } from '@nestjs/common';

import {
  hashToken,
  validateRefreshToken,
} from '@/features/refresh-tokens/helpers';

type RefreshTokenRecord = {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  isRevoked: boolean;
};

describe('Refresh token helpers', () => {
  describe('hashToken', () => {
    it('hashes token using sha256', () => {
      const result1 = hashToken('raw_token');
      const result2 = hashToken('raw_token');
      const result3 = hashToken('other_token');

      // sha256 hex-encoded = 64 chars
      expect(result1).toHaveLength(64);
      // deterministic
      expect(result1).toBe(result2);
      // different token ⇒ different hash
      expect(result1).not.toBe(result3);
    });
  });

  describe('validateRefreshToken', () => {
    const baseToken: RefreshTokenRecord = {
      tokenHash: 'hash',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 60_000),
      isRevoked: false,
    };

    it('does not throw for valid token', () => {
      expect(() =>
        validateRefreshToken(baseToken as any, 'user-id'),
      ).not.toThrow();
    });

    it('throws when token is null', () => {
      expect(() => validateRefreshToken(null as any, 'user-id')).toThrow(
        UnauthorizedException,
      );
    });

    it('throws when userId does not match', () => {
      expect(() =>
        validateRefreshToken(
          { ...baseToken, userId: 'other' } as any,
          'user-id',
        ),
      ).toThrow(UnauthorizedException);
    });

    it('throws when token is revoked', () => {
      expect(() =>
        validateRefreshToken(
          { ...baseToken, isRevoked: true } as any,
          'user-id',
        ),
      ).toThrow(UnauthorizedException);
    });

    it('throws when token is expired', () => {
      expect(() =>
        validateRefreshToken(
          { ...baseToken, expiresAt: new Date(Date.now() - 1000) } as any,
          'user-id',
        ),
      ).toThrow(UnauthorizedException);
    });
  });
});
