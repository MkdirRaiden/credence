// src/features/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { NotFound } from '@/common/decorators/not-found.decorator';
import { FieldSelectorContext } from '@/common/interfaces';
import { createPrismaSelect } from '@/common/utils';
import { USER_FIELD_VISIBILITY_CONFIG } from '@/features/users/users.config';
import {
  DEFAULT_PAGINATION_SKIP,
  DEFAULT_PAGINATION_TAKE,
} from '@/common/constants';

@Injectable()
export class UsersRepository {
  // Injecting PrismaService
  constructor(private readonly prisma: PrismaService) {}

  // Create a new user
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // Get all users with pagination
  async findAll(context: FieldSelectorContext): Promise<Partial<User>[]> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    const skip = context.skip ?? DEFAULT_PAGINATION_SKIP;
    const take = context.take ?? DEFAULT_PAGINATION_TAKE;
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      select,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  //  Get a user by ID
  @NotFound('User not found')
  async findById(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User> | null> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select,
    });
  }

  // Update a user by ID
  @NotFound('User not found')
  async update(
    id: string,
    data: Prisma.UserUpdateInput,
    context: FieldSelectorContext,
  ): Promise<Partial<User> | null> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    return this.prisma.user.update({
      where: { id, deletedAt: null },
      data,
      select,
    });
  }

  // Soft delete a user by ID
  @NotFound('User not found')
  async softDelete(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User> | null> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    return this.prisma.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
      select,
    });
  }

  // Get a user by email
  @NotFound('User not found')
  async findByEmail(
    email: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User> | null> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    return this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      select,
    });
  }

  // Get a user by phone
  @NotFound('User not found')
  async findByPhone(
    phone: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User> | null> {
    const select = createPrismaSelect(USER_FIELD_VISIBILITY_CONFIG, context);
    return this.prisma.user.findFirst({
      where: { phone, deletedAt: null },
      select,
    });
  }

  // Check if email exists
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email, deletedAt: null },
    });
    return count > 0;
  }

  // Check if phone exists
  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { phone, deletedAt: null },
    });
    return count > 0;
  }
}
