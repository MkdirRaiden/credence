// src/features/users/repositories/users-crud.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';
import { Prisma, User } from '@prisma/client';
import { NotFound } from '@/common/decorators';
import { DeletedResourceDto } from '@/features/users/dtos';

@Injectable()
export class UsersCrudRepository {
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
      where: { id },
      data,
    });
  }

  /**
   * Soft delete a user by ID.
   */
  @NotFound('User not found')
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
