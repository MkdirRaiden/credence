// src/features/refresh-tokens/refresh-token.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { RefreshTokenRepository } from '@/features/refresh-tokens/repositories';
import * as helpers from '@/features/refresh-tokens/helpers';
import { LOG_CONTEXTS } from '@/common/constants';
import { BaseTokenService } from '@/features/refresh-tokens/contracts';

/**
 * Manages refresh token lifecycle (create, verify, revoke)
 */
@Injectable()
export class RefreshTokenService extends BaseTokenService {
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async create(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.repository.create(userId, refreshToken, expiresAt);
    this.logger.log(
      `Token created for user: ${userId}`,
      LOG_CONTEXTS.REFRESH_TOKEN,
    );
  }

  async verify(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = helpers.hashToken(refreshToken);
    const token = await this.repository.findByHash(tokenHash);
    helpers.validateRefreshToken(token, userId);
  }

  async revoke(refreshToken: string): Promise<void> {
    const tokenHash = helpers.hashToken(refreshToken);
    await this.repository.update(tokenHash, { isRevoked: true });
    this.logger.log('Token revoked', LOG_CONTEXTS.REFRESH_TOKEN);
  }

  async revokeAllByUser(userId: string): Promise<void> {
    await this.repository.updateManyByUserId(userId, { isRevoked: true });
    this.logger.log(
      `All tokens revoked for user: ${userId}`,
      LOG_CONTEXTS.REFRESH_TOKEN,
    );
  }
}
