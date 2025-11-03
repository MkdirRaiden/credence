// src/features/auth/helpers/auth.helpers.ts
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWT_EXPIRATION, JWT_REFRESH_EXPIRATION } from '@/common/constants';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  plain: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

export const generateTokens = (
  jwtService: JwtService,
  userId: string,
  email: string,
): { accessToken: string; refreshToken: string; expiresIn: number } => {
  const accessTokenPayload = { sub: userId, email };
  const refreshTokenPayload = { sub: userId, email };

  // Access token: 15 minutes
  const accessToken = jwtService.sign(accessTokenPayload, {
    expiresIn: JWT_EXPIRATION,
  });

  // Refresh token: 7 days
  const refreshToken = jwtService.sign(refreshTokenPayload, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });

  // Calculate expiresIn in seconds
  const decoded: { exp?: number } | null = jwtService.decode(accessToken);
  const expiresIn = decoded?.exp
    ? decoded.exp - Math.floor(Date.now() / 1000)
    : JWT_EXPIRATION;

  return { accessToken, refreshToken, expiresIn };
};
