// src/features/auth/strategies/local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@/features/auth/auth.service';
import { extractLoginIdentifier } from '@/features/auth/helpers';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  /**
   * Passport calls this with the request object.
   * Delegates identifier extraction and validation to helpers.
   */
  async validate(
    req: { body?: Record<string, unknown> },
    email: string,
    password: string,
  ): Promise<any> {
    // Extract email or username using utility
    const emailOrUsername = extractLoginIdentifier(email, req.body);

    const user = await this.authService.validateUser(emailOrUsername, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email, username, or password');
    }
    return user;
  }
}
