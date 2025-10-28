// src/features/users/mappers/users.mapper.ts
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from '@/features/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/features/users/dtos/update-user.dto';
import { UserResponseDto } from '@/features/users/dtos/user-response.dto';

// Map CreateUserDto to Prisma create input
export const toCreateInput = (dto: CreateUserDto): Prisma.UserCreateInput => ({
  email: dto.email,
  phone: dto.phone,
  name: dto.name,
  avatarUrl: dto.avatarUrl,
  // referralCode handling will be done in service layer
});

// Map UpdateUserDto to Prisma update input (functional approach)
export const toUpdateInput = (dto: UpdateUserDto): Prisma.UserUpdateInput => {
  return Object.fromEntries(
    Object.entries(dto).filter(([, value]) => value !== undefined),
  ) as Prisma.UserUpdateInput;
};

// Map Prisma User entity to UserResponseDto
export const toResponseDto = (user: User): UserResponseDto => ({
  id: user.id,
  email: user.email,
  phone: user.phone ?? undefined,
  name: user.name ?? undefined,
  avatarUrl: user.avatarUrl ?? undefined,
  emailVerified: user.emailVerified,
  phoneVerified: user.phoneVerified,
  role: user.role,
  referredById: user.referredById ?? undefined,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Map array of User entities to array of UserResponseDto
export const toResponseDtoList = (users: User[]): UserResponseDto[] =>
  users.map(toResponseDto);
