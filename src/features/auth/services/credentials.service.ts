// src/features/auth/services/credentials.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { BaseAuthService } from '@/features/users/contracts';
import { verifyPassword } from '@/features/auth/helpers';
import { UserResponseDto } from '@/features/auth/dtos';

@Injectable()
export class CredentialsService {
  constructor(
    @Inject(BaseAuthService) private readonly authService: BaseAuthService,
  ) {}

  async validate(
    emailOrUsername: string,
    password: string,
  ): Promise<Partial<UserResponseDto> | null> {
    const user = emailOrUsername.includes('@')
      ? await this.authService.findByEmailForAuth(emailOrUsername)
      : await this.authService.findByUsernameForAuth(emailOrUsername);

    if (!user?.passwordHash) return null;

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) return null;

    const { passwordHash: _passwordHash, ...result } = user;
    return result as Partial<UserResponseDto>;
  }
}
