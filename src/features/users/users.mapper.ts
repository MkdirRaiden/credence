// src/features/users/users.mapper.ts
import { Prisma, User } from '@prisma/client';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@/features/users/dtos';
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

/**
 * Map User to UserResponseDto, excluding sensitive fields.
 * Defense in depth: removes passwordHash even if visibility permits.
 */
export const toResponseDto = (
  user: Partial<User>,
): Partial<UserResponseDto> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeFields } = user;
  return filterUndefined(safeFields) as Partial<UserResponseDto>;
};

/**
 * Map array of Users to array of UserResponseDtos.
 */
export const toResponseDtoList = (
  users: Partial<User>[],
): Partial<UserResponseDto>[] => users.map(toResponseDto);
