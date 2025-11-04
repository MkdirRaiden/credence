// src/features/auth/helpers/verify-jwt-token.ts
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export function verifyJwtToken(
  jwtService: JwtService,
  token: string,
): { sub: string; email: string; username?: string } {
  try {
    return jwtService.verify(token);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new UnauthorizedException(`Invalid or expired token: ${message}`);
  }
}
