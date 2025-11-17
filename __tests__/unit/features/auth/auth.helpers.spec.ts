// __tests__/unit/features/auth/auth.helpers.spec.ts
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import {
  hashPassword,
  verifyPassword,
  generateTokens
} from '@/features/auth/helpers';

jest.mock('bcrypt');

describe('Auth helpers', () => {
  describe('hashPassword / verifyPassword', () => {
    it('hashPassword delegates to bcrypt.hash', async () => {
      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('hashed_pw' as never);

      const result = await hashPassword('plain');

      expect(hashSpy).toHaveBeenCalledWith('plain', 10);
      expect(result).toBe('hashed_pw');
    });

    it('verifyPassword delegates to bcrypt.compare', async () => {
      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(true as never);

      const result = await verifyPassword('plain', 'hashed_pw');

      expect(compareSpy).toHaveBeenCalledWith('plain', 'hashed_pw');
      expect(result).toBe(true);
    });
  });

  describe('generateTokens', () => {
    let jwtService: jest.Mocked<JwtService>;

    beforeEach(() => {
      jwtService = {
        sign: jest.fn(),
        decode: jest.fn(),
      } as any;
    });

    it('builds payload with optional username and role and returns tokens + expiresIn', () => {
      const now = Math.floor(Date.now() / 1000);
      jwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');
      jwtService.decode.mockReturnValue({ exp: now + 900 }); // 15 minutes

      const result = generateTokens(
        jwtService,
        'user-id',
        'user@example.com',
        'username',
        'USER' as any,
      );

      expect(jwtService.sign).toHaveBeenNthCalledWith(
        1,
        {
          sub: 'user-id',
          email: 'user@example.com',
          username: 'username',
          role: 'USER',
        },
        expect.objectContaining({ expiresIn: expect.anything() }),
      );
      expect(jwtService.sign).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          sub: 'user-id',
          email: 'user@example.com',
          username: 'username',
          role: 'USER',
        }),
        expect.objectContaining({ expiresIn: expect.anything() }),
      );

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        expiresIn: 900,
      });
    });

    it('falls back to configured expiration if exp missing', () => {
      jwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');
      jwtService.decode.mockReturnValue(null);

      const result = generateTokens(jwtService, 'user-id', 'user@example.com');

      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
      // we don’t assert exact expiresIn value here, just that it is > 0
      expect(result.expiresIn).toBeGreaterThan(0);
    });
  });
});
