// src/features/users/repositories/users-lookup.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';
import { User } from '@prisma/client';
import { NotFound } from '@/common/decorators';
import { FieldSelectorContext } from '@/common/interfaces';
import { createPrismaSelect } from '@/common/utils';
import * as constants from '@/features/users/constants';

@Injectable()
export class UsersLookupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(context: FieldSelectorContext): Promise<Partial<User>[]> {
    const select = createPrismaSelect(
      constants.USER_FIELD_VISIBILITY_CONFIG,
      context,
    );
    const skip = context.skip ?? constants.PAGINATION_LIMITS.DEFAULT_SKIP;
    const take = context.take ?? constants.PAGINATION_LIMITS.DEFAULT_TAKE;
    const users = await this.prisma.user.findMany({
      select,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return users;
  }

  @NotFound(constants.USER_NOT_FOUND)
  async findById(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User>> {
    const select = createPrismaSelect(
      constants.USER_FIELD_VISIBILITY_CONFIG,
      context,
    );
    const user = await this.prisma.user.findUnique({
      where: { id },
      select,
    });
    return user as Partial<User>;
  }

  @NotFound(constants.USER_NOT_FOUND)
  async findByEmail(
    email: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User>> {
    const select = createPrismaSelect(
      constants.USER_FIELD_VISIBILITY_CONFIG,
      context,
    );
    const user = await this.prisma.user.findUnique({
      where: { email },
      select,
    });
    return user as Partial<User>;
  }

  @NotFound(constants.USER_NOT_FOUND)
  async findByUsername(
    username: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User>> {
    const select = createPrismaSelect(
      constants.USER_FIELD_VISIBILITY_CONFIG,
      context,
    );
    const user = await this.prisma.user.findUnique({
      where: { username },
      select,
    });
    return user as Partial<User>;
  }

  @NotFound(constants.USER_NOT_FOUND)
  async findByPhone(
    phone: string,
    context: FieldSelectorContext,
  ): Promise<Partial<User>> {
    const select = createPrismaSelect(
      constants.USER_FIELD_VISIBILITY_CONFIG,
      context,
    );
    const user = await this.prisma.user.findFirst({
      where: { phone },
      select,
    });
    return user as Partial<User>;
  }
}
