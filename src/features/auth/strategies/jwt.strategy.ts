// src/features/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserResponseDto } from '@/features/users/dtos';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }
  // Passport automatically calls this method with the decoded JWT payload.
  validate(payload: { sub: string; email: string }): UserResponseDto {
    // Payload comes from the JWT token
    // Return user data to attach to request.user
    return {
      id: payload.sub,
      email: payload.email,
    } as UserResponseDto;
  }
}
