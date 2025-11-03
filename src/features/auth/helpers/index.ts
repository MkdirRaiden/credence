// src/features/auth/helpers/auth.helpers.ts
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

/**
 * Hash a plain password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/**
 * Verify plain password against hash
 * @param plain - Plain text password from user
 * @param hash - Hashed password from database
 * @returns True if password matches, false otherwise
 */
export const verifyPassword = async (
  plain: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

/**
 * Generate access and refresh tokens
 * @param jwtService - NestJS JwtService
 * @param userId - User's unique ID
 * @param email - User's email
 * @returns Object with accessToken, refreshToken, and expiresIn (seconds)
 */
export const generateTokens = (
  jwtService: JwtService,
  userId: string,
  email: string,
): { accessToken: string; refreshToken: string; expiresIn: number } => {
  const accessTokenPayload = { sub: userId, email };
  const refreshTokenPayload = { sub: userId, email };

  // Generate access token (short-lived: 15 minutes)
  const accessToken = jwtService.sign(accessTokenPayload, {
    expiresIn: '15m',
  });

  // Generate refresh token (long-lived: 7 days)
  const refreshToken = jwtService.sign(refreshTokenPayload, {
    expiresIn: '7d',
    secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  });

  // Decode access token to calculate expiresIn in seconds
  const decoded: { exp?: number } | null = jwtService.decode(accessToken);
  const expiresIn = decoded?.exp
    ? decoded.exp - Math.floor(Date.now() / 1000)
    : 900;

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
};
