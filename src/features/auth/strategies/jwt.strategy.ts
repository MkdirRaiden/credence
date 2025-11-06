// src/features/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from '@/features/users/dtos';
import type { AppConfig } from '@/common/interfaces/app-config.interface';

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
  }): Partial<UserResponseDto> {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}
