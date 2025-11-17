// src/features/users/repositories/users-conflict.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';

@Injectable()
export class UsersConflictRepository {
  constructor(private readonly prisma: PrismaService) {}

  async isEmailTaken(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { username },
    });
    return count > 0;
  }

  async isPhoneTaken(phone: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { phone },
    });
    return count > 0;
  }
}
