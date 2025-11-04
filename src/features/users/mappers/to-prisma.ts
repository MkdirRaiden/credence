// src/features/users/mappers/to-prisma.ts
import { Prisma } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '@/features/users/dtos';
import { filterUndefined } from '@/common/utils';
/**
 * Map CreateUserDto to Prisma UserCreateInput.
 */
export const toCreateInput = (
  dto: CreateUserDto & { passwordHash?: string },
): Prisma.UserCreateInput => ({
  email: dto.email,
  phone: dto.phone,
  name: dto.name,
  avatarUrl: dto.avatarUrl,
  passwordHash: dto.passwordHash,
});

/**
 * Map UpdateUserDto to Prisma UserUpdateInput.
 * Filters undefined values to avoid overwriting with null.
 */
export const toUpdateInput = (dto: UpdateUserDto): Prisma.UserUpdateInput => {
  return filterUndefined(dto);
};
