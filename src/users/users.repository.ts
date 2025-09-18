// users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { BaseService } from '../common/base.service';

@Injectable()
export class UsersRepository extends BaseService<User> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return this.throwIfNotFound(user, `User with id ${id} not found`);
  }

  async findByEmailOrThrow(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return this.throwIfNotFound(user, `User with email ${email} not found`);
  }
}
