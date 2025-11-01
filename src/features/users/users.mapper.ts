// src/features/users/users.mapper.ts
import { Prisma, User } from '@prisma/client';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@/features/users/dtos';
import { filterUndefined } from '@/common/utils';

export const toCreateInput = (
  dto: CreateUserDto & { passwordHash?: string },
): Prisma.UserCreateInput => ({
  email: dto.email,
  phone: dto.phone,
  name: dto.name,
  avatarUrl: dto.avatarUrl,
  passwordHash: dto.passwordHash, // May be undefined if created without password
});

export const toUpdateInput = (dto: UpdateUserDto): Prisma.UserUpdateInput => {
  return filterUndefined(dto);
};

/**
 * Map full/partial User to safe UserResponseDto
 * Explicitly exclude sensitive fields (defense in depth, even if visibility prevents them)
 */
export const toResponseDto = (
  user: Partial<User>,
): Partial<UserResponseDto> => {
  // Destructure to exclude sensitive field passwordHash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeFields } = user;
  return filterUndefined(safeFields) as Partial<UserResponseDto>;
};

export const toResponseDtoList = (
  users: Partial<User>[],
): Partial<UserResponseDto>[] => users.map(toResponseDto);
