// src/features/shared/tokens/refresh-token.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';
import { hashToken } from '@/features/shared/tokens/helpers';

@Injectable()
export class RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, refreshToken: string, expiresAt: Date) {
    const tokenHash = hashToken(refreshToken);
    return this.prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt, isRevoked: false },
    });
  }

  async findByHash(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
  }

  async update(tokenHash: string, data: Record<string, unknown>) {
    return this.prisma.refreshToken.update({
      where: { tokenHash },
      data,
    });
  }

  async updateManyByUserId(userId: string, data: Record<string, unknown>) {
    return this.prisma.refreshToken.updateMany({
      where: { userId },
      data,
    });
  }

  async deleteExpired() {
    return this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}
