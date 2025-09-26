// src/features/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { DatabasePrismaService } from '../../database/database-prisma.service';
import { User, Prisma } from '@prisma/client';
import { NotFound } from '../../common/decorators/not-found.decorator';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: DatabasePrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  @NotFound('User with this ID not found')
  async findById(id: string): Promise<User> {
    return (await this.prisma.user.findUnique({ where: { id } })) as User;
  }

  @NotFound('User with this email not found')
  async findByEmail(email: string): Promise<User> {
    return (await this.prisma.user.findUnique({ where: { email } })) as User;
  }
}
