// src/features/users/repositories/users-auth.repository.ts
import * as constants from '@/features/users/constants';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';
import { User } from '@prisma/client';
import { NotFound } from '@/common/decorators';

@Injectable()
export class UsersAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  @NotFound(constants.USER_NOT_FOUND)
  async findByEmailForAuth(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: constants.AUTH_USER_SELECT,
    });
    return user as unknown as User;
  }

  @NotFound(constants.USER_NOT_FOUND)
  async findByUsernameForAuth(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: constants.AUTH_USER_SELECT,
    });
    return user as unknown as User;
  }
}
