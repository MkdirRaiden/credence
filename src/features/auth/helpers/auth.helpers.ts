// src/features/auth/helpers/auth.helpers.ts
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as constants from '@/features/auth/constants';
import { UserRole } from '@prisma/client';

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
  username?: string,
  role?: UserRole,
): { accessToken: string; refreshToken: string; expiresIn: number } => {
  const payload = {
    sub: userId,
    email,
    ...(username && { username }),
    ...(role && { role }),
  };

  // Access token: 15 minutes
  const accessToken = jwtService.sign(payload, {
    expiresIn: constants.JWT_EXPIRATION,
  });

  // Refresh token: 7 days
  const refreshToken = jwtService.sign(payload, {
    expiresIn: constants.JWT_REFRESH_EXPIRATION,
  });

  // Calculate expiresIn in seconds
  const decoded: { exp?: number } | null = jwtService.decode(accessToken);
  const expiresIn = decoded?.exp
    ? decoded.exp - Math.floor(Date.now() / 1000)
    : constants.JWT_EXPIRATION;

  return { accessToken, refreshToken, expiresIn };
};
