// __tests__/unit/features/refresh-tokens/refresh-token.helpers.spec.ts
import {
  hashToken,
  isRefreshTokenValid,
  type RefreshTokenRecord,
} from '@/features/shared/tokens/helpers';

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

  describe('isRefreshTokenValid', () => {
    const baseToken: RefreshTokenRecord = {
      tokenHash: 'hash',
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 60_000),
      isRevoked: false,
    };

    it('returns true for valid token', () => {
      const result = isRefreshTokenValid(baseToken, 'user-id');

      expect(result).toBe(true);
    });

    it('returns false when token is null', () => {
      const result = isRefreshTokenValid(null, 'user-id');

      expect(result).toBe(false);
    });

    it('returns false when userId does not match', () => {
      const result = isRefreshTokenValid(
        { ...baseToken, userId: 'other' },
        'user-id',
      );

      expect(result).toBe(false);
    });

    it('returns false when token is revoked', () => {
      const result = isRefreshTokenValid(
        { ...baseToken, isRevoked: true },
        'user-id',
      );

      expect(result).toBe(false);
    });

    it('returns false when token is expired', () => {
      const result = isRefreshTokenValid(
        { ...baseToken, expiresAt: new Date(Date.now() - 1000) },
        'user-id',
      );

      expect(result).toBe(false);
    });
  });
});
