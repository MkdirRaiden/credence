// src/common/exceptions/user-domain.exception.ts
import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@/common/exceptions/base';

export class UserNotFoundException extends DomainException {
  constructor() {
    super(
      {
        code: 'USER.NOT_FOUND',
        message: 'User not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class EmailAlreadyInUseException extends DomainException {
  constructor(email: string) {
    super(
      {
        code: 'USER.EMAIL_ALREADY_IN_USE',
        message: `A user with email ${email} already exists`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class UsernameAlreadyInUseException extends DomainException {
  constructor(username: string) {
    super(
      {
        code: 'USER.USERNAME_ALREADY_IN_USE',
        message: `A user with username ${username} already exists`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class PhoneAlreadyInUseException extends DomainException {
  constructor(phone: string) {
    super(
      {
        code: 'USER.PHONE_ALREADY_IN_USE',
        message: `A user with phone ${phone} already exists`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class UserAccessForbiddenException extends DomainException {
  constructor() {
    super(
      {
        code: 'USER.ACCESS_FORBIDDEN',
        message: 'You can only access your own resources',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
