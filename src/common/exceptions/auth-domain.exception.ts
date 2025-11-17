// src/common/exceptions/auth-domain.exception.ts
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@/common/exceptions/base';

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super(
      {
        code: 'AUTH.INVALID_CREDENTIALS',
        message: 'Invalid email, username, or password',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InvalidRefreshTokenException extends DomainException {
  constructor() {
    super(
      {
        code: 'AUTH.INVALID_REFRESH_TOKEN',
        message: 'Invalid or expired refresh token',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

