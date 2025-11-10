// src/features/refresh-tokens/refresh-token.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { RefreshTokenRepository } from '@/features/refresh-tokens/repositories';
import * as helpers from '@/features/refresh-tokens/helpers';
import { LOG_CONTEXTS } from '@/common/constants';

/**
 * Manages refresh token lifecycle (create, verify, revoke)
 */
@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Hash and store refresh token in DB
   */
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

  /**
   * Verify token exists in DB, not revoked, not expired
   */
  async verify(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = helpers.hashToken(refreshToken);
    const token = await this.repository.findByHash(tokenHash);
    helpers.validateRefreshToken(token, userId);
  }

  /**
   * Revoke single token (logout)
   */
  async revoke(refreshToken: string): Promise<void> {
    const tokenHash = helpers.hashToken(refreshToken);
    await this.repository.update(tokenHash, { isRevoked: true });
    this.logger.log('Token revoked', LOG_CONTEXTS.REFRESH_TOKEN);
  }

  /**
   * Revoke all user tokens (logout all devices)
   */
  async revokeAllByUser(userId: string): Promise<void> {
    await this.repository.updateManyByUserId(userId, { isRevoked: true });
    this.logger.log(
      `All tokens revoked for user: ${userId}`,
      LOG_CONTEXTS.REFRESH_TOKEN,
    );
  }
}
