// src/features/auth/strategies/local.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CredentialsService } from '@/features/auth/services';
import { InvalidCredentialsException } from '@/common/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private credentialsService: CredentialsService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: { body?: Record<string, unknown> },
    email: string,
    password: string,
  ): Promise<any> {
    const emailOrUsername = email || (req.body?.username as string);
    const user = await this.credentialsService.validate(
      emailOrUsername,
      password,
    );

    if (!user) throw new InvalidCredentialsException();

    return user;
  }
}
