// src/features/users/repositories/users-crud.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';
import { Prisma, User } from '@prisma/client';
import { NotFound } from '@/common/decorators';
import { DeletedResourceDto } from '@/features/users/dtos';
import * as constants from '@/features/users/constants';

@Injectable()
export class UsersCrudRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  @NotFound(constants.USER_NOT_FOUND)
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  @NotFound(constants.USER_NOT_FOUND)
  async softDelete(id: string): Promise<DeletedResourceDto> {
    const deleted = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    return deleted as unknown as DeletedResourceDto;
  }
}
