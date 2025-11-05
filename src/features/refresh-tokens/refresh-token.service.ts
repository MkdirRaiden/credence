// src/features/refresh-tokens/refresh-token.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/services/logger.service';
import { RefreshTokenRepository } from '@/features/refresh-tokens/refresh-token.repository';
import {
  validateRefreshToken,
  hashToken,
} from '@/features/refresh-tokens/helpers';

/**
 * Manages refresh token lifecycle (create, verify, revoke)
 */
@Injectable()
export class RefreshTokenService {
  private readonly logContext = 'RefreshTokenService';

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
    this.logger.log(`Token created for user: ${userId}`, this.logContext);
  }

  /**
   * Verify token exists in DB, not revoked, not expired
   */
  async verify(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    const token = await this.repository.findByHash(tokenHash);
    validateRefreshToken(token, userId);
  }

  /**
   * Revoke single token (logout)
   */
  async revoke(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.repository.update(tokenHash, { isRevoked: true });
    this.logger.log('Token revoked', this.logContext);
  }

  /**
   * Revoke all user tokens (logout all devices)
   */
  async revokeAllByUser(userId: string): Promise<void> {
    await this.repository.updateManyByUserId(userId, { isRevoked: true });
    this.logger.log(`All tokens revoked for user: ${userId}`, this.logContext);
  }
}
