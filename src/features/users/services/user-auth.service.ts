// src/features/users/services/user-auth.service.ts
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { LoggerService } from '@/logger/services';
import { UsersAuthRepository } from '@/features/users/repositories';
import { BaseAuthService } from '@/features/users/contracts';
import { LOG_CONTEXTS } from '@/logger/constants';

/**
 * User authentication queries (bypasses visibility/field selection)
 */
@Injectable()
export class UserAuthService extends BaseAuthService {
  constructor(
    private readonly repository: UsersAuthRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  /**
   * Get full user by email for auth verification
   */
  async findByEmailForAuth(email: string): Promise<User> {
    this.logger.log(`Finding user for auth: ${email}`, LOG_CONTEXTS.USER);
    return await this.repository.findByEmailForAuth(email);
  }

  /**
   * Get full user by username for auth verification
   */
  async findByUsernameForAuth(username: string): Promise<User> {
    this.logger.log(
      `Finding user for auth by username: ${username}`,
      LOG_CONTEXTS.USER,
    );
    return await this.repository.findByUsernameForAuth(username);
  }
}
