// src/features/refresh-tokens/refresh-token.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services/prisma.service';
import { hashToken } from '@/features/refresh-tokens/helpers';

@Injectable()
export class RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Hash and store refresh token in DB
   */
  async create(userId: string, refreshToken: string, expiresAt: Date) {
    const tokenHash = hashToken(refreshToken);
    return this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt, isRevoked: false },
    });
  }

  /**
   * Find token by hash
   */
  async findByHash(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
  }

  /**
   * Update token (e.g., revoke)
   */
  async update(tokenHash: string, data: Record<string, unknown>) {
    return this.prisma.refreshToken.update({
      where: { tokenHash },
      data,
    });
  }

  /**
   * Update all user tokens
   */
  async updateManyByUserId(userId: string, data: Record<string, unknown>) {
    return this.prisma.refreshToken.updateMany({
      where: { userId },
      data,
    });
  }

  /**
   * Delete expired tokens (Phase 4: Cron job)
   */
  async deleteExpired() {
    return this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
