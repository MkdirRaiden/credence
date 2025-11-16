// src/features/users/services/users-auth.service.ts
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { LoggerService } from '@/logger/services';
import { UsersAuthRepository } from '@/features/users/repositories';
import { BaseAuthService } from '@/features/users/contracts';
import { LOG_CONTEXTS } from '@/common/constants';

/**
 * User authentication queries (bypasses visibility/field selection)
 */
@Injectable()
export class UsersAuthService extends BaseAuthService {
  constructor(
    private readonly repository: UsersAuthRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async findByEmailForAuth(email: string): Promise<User> {
    this.logger.log(`Finding user for auth: ${email}`, LOG_CONTEXTS.USER);
    return await this.repository.findByEmailForAuth(email);
  }

  async findByUsernameForAuth(username: string): Promise<User> {
    this.logger.log(
      `Finding user for auth by username: ${username}`,
      LOG_CONTEXTS.USER,
    );
    return await this.repository.findByUsernameForAuth(username);
  }
}
