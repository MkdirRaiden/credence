// src/features/users/to-response.ts
import { User } from '@prisma/client';
import { UserResponseDto } from '@/features/users/dtos';
import { filterUndefined } from '@/common/utils';

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
