// src/features/auth/services/credentials.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { BaseAuthService } from '@/features/users/contracts';
import { validateUserCredentials } from '@/features/auth/helpers';
import { UserResponseDto } from '@/features/auth/dtos';

/**
 * Validates user credentials (email/username + password)
 * Used by LocalStrategy for passport authentication
 */
@Injectable()
export class CredentialsService {
  constructor(
    @Inject(BaseAuthService) private readonly authService: BaseAuthService,
  ) {}

  async validate(
    emailOrUsername: string,
    password: string,
  ): Promise<Partial<UserResponseDto> | null> {
    return validateUserCredentials(emailOrUsername, password, this.authService);
  }
}
