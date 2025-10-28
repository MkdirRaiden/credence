import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Prisma, User } from '@prisma/client';
import { NotFound } from '@/common/decorators/not-found.decorator';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new user
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // Find all active users with pagination
  async findAll(skip = 0, take = 10): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Find user by ID (only active users)
  @NotFound('User not found')
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  // Find user by email (only active users)
  @NotFound('User not found')
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
  }

  // Find user by phone (only active users)
  @NotFound('User not found')
  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { phone, deletedAt: null },
    });
  }

  // Update user by ID
  @NotFound('User not found')
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    return this.prisma.user.update({
      where: { id, deletedAt: null },
      data,
    });
  }

  // Soft delete user by ID
  @NotFound('User not found')
  async softDelete(id: string): Promise<User | null> {
    return this.prisma.user.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
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
