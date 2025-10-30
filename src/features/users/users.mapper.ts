// src/features/users/users.mapper.ts
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from '@/features/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/features/users/dtos/update-user.dto';
import { UserResponseDto } from '@/features/users/dtos/user-response.dto';
import { filterUndefined } from '@/common/utils';

export const toCreateInput = (dto: CreateUserDto): Prisma.UserCreateInput => ({
  email: dto.email,
  phone: dto.phone,
  name: dto.name,
  avatarUrl: dto.avatarUrl,
});

export const toUpdateInput = (dto: UpdateUserDto): Prisma.UserUpdateInput => {
  return filterUndefined(dto);
};

export const toResponseDto = (
  user: Partial<User>,
): Partial<UserResponseDto> => {
  return filterUndefined(user) as Partial<UserResponseDto>;
};

export const toResponseDtoList = (
  users: Partial<User>[],
): Partial<UserResponseDto>[] => users.map(toResponseDto);
