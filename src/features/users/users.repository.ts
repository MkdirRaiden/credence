// src/features/users/users.repository.ts
import {
  USER_FIELD_VISIBILITY_CONFIG,
  AUTH_USER_SELECT,
  PAGINATION_LIMITS,
} from '@/features/users/users.config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { NotFound } from '@/common/decorators';
import { FieldSelectorContext } from '@/common/interfaces';
import { createPrismaSelect } from '@/common/utils';
import { DeletedResourceDto } from '@/common/dtos';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user with full User return.
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  /**
   * Update a user by ID (@NotFound guarantees non-null).
   */
  @NotFound('User not found')
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id, deletedAt: null },
      data,
    });
  }

  /**
   * Soft delete a user by ID.
   */
  @NotFound('User not found')
  async softDelete(id: string): Promise<DeletedResourceDto> {
    const deleted = await this.prisma.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        deletedAt: true,
      },
    });
    return deleted as unknown as DeletedResourceDto;
  }

  /**
   * Get all users with pagination and visibility.
   */
  async findAll(context: FieldSelectorContext): Promise<Partial<User>[]> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    const skip = context.skip ?? PAGINATION_LIMITS.DEFAULT_SKIP;
    const take = context.take ?? PAGINATION_LIMITS.DEFAULT_TAKE;
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
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
      where: { id, deletedAt: null },
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
      where: { email, deletedAt: null },
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
      where: { phone, deletedAt: null },
      select,
    });
    return user as unknown as Partial<User>;
  }

  /**
   * Get full user by email for auth verification (bypasses visibility).
   */
  @NotFound('User not found for auth')
  async findByEmailForAuth(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      select: AUTH_USER_SELECT,
    });
    return user as unknown as User;
  }
}
