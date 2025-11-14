// src/features/users/repositories/users-auth.repository.ts
import { AUTH_USER_SELECT } from '@/features/users/constants';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';
import { User } from '@prisma/client';
import { NotFound } from '@/common/decorators';

@Injectable()
export class UsersAuthRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Get full user by email for auth verification (bypasses visibility).
   */
  @NotFound('User not found for auth')
  async findByEmailForAuth(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: AUTH_USER_SELECT,
    });
    return user as unknown as User;
  }

  /**
   * Get full user by username for auth verification (bypasses visibility).
   */
  @NotFound('User not found for auth')
  async findByUsernameForAuth(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: AUTH_USER_SELECT,
    });
    return user as unknown as User;
  }
}
