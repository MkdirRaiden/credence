// src/features/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { UserResponseDto } from '@/features/auth/dtos';
import type { AppConfig } from '@/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<AppConfig, true>) {
    const jwtConfig = configService.get('jwt', { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.jwtSecret,
    });
  }

  /**
   * Payload comes from the JWT token
   * Return user data to attach to request.user
   */
  validate(payload: {
    sub: string;
    email: string;
    username?: string;
    role?: UserRole;
  }): Partial<UserResponseDto> {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role || UserRole.USER,
    };
  }
}
