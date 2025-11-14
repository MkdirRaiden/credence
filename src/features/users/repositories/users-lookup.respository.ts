// src/features/users/repositories/users-lookup.repository.ts
import {
  USER_FIELD_VISIBILITY_CONFIG,
  PAGINATION_LIMITS,
} from '@/features/users/constants';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';
import { User } from '@prisma/client';
import { NotFound } from '@/common/decorators';
import { FieldSelectorContext } from '@/common/interfaces';
import { createPrismaSelect } from '@/common/utils';

@Injectable()
export class UsersLookupRepository {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Get all users with pagination and visibility.
   */
  async findAll(context: FieldSelectorContext): Promise<Partial<User>[]> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    const skip = context.skip ?? PAGINATION_LIMITS.DEFAULT_SKIP;
    const take = context.take ?? PAGINATION_LIMITS.DEFAULT_TAKE;
    const users = await this.prisma.user.findMany({
      select,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return users as unknown as Partial<User>[];
  }

  /**
   * Get a user by ID with visibility.
   */
  @NotFound('User not found')
  async findById(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User>> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    const user = await this.prisma.user.findUnique({
      where: { id },
      select,
    });
    return user as unknown as Partial<User>;
  }

  /**
   * Get a user by email with visibility.
   */
  @NotFound('User not found')
  async findByEmail(
    email: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User>> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    const user = await this.prisma.user.findUnique({
      where: { email },
      select,
    });
    return user as unknown as Partial<User>;
  }

  /**
   * Get a user by username with visibility (public endpoint).
   */
  @NotFound('User not found')
  async findByUsername(
    username: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User>> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    const user = await this.prisma.user.findUnique({
      where: { username },
      select,
    });
    return user as unknown as Partial<User>;
  }

  /**
   * Get a user by phone with visibility.
   */
  @NotFound('User not found')
  async findByPhone(
    phone: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User>> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    const user = await this.prisma.user.findFirst({
      where: { phone },
      select,
    });
    return user as unknown as Partial<User>;
  }
}
