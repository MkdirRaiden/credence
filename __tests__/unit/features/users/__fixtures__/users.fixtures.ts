// __tests__/unit/features/users/__fixtures__/users.fixtures.ts
import { User, UserRole } from '@prisma/client';
import { CreateUserDto } from '@/features/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/features/users/dtos/update-user.dto';
import { UserResponseDto } from '@/features/users/dtos/user-response.dto';

// Mock User entities
export const mockUser: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'user@example.com',
  phone: '+1234567890',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  passwordHash: 'hashed_password_should_not_be_exposed',
  emailVerified: true,
  phoneVerified: false,
  role: UserRole.USER,
  referredById: '456e4567-e89b-12d3-a456-426614174000',
  deletedAt: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
};

export const mockUserWithNulls: User = {
  ...mockUser,
  phone: null,
  name: null,
  avatarUrl: null,
  referredById: null,
};

export const mockAdminUser: User = {
  ...mockUser,
  id: '999e4567-e89b-12d3-a456-426614174000',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
};

export const mockUserList: User[] = [
  {
    id: '1',
    email: 'user1@example.com',
    phone: null,
    name: 'User One',
    avatarUrl: null,
    passwordHash: 'hash1',
    emailVerified: true,
    phoneVerified: false,
    role: UserRole.USER,
    referredById: null,
    deletedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'user2@example.com',
    phone: '+9876543210',
    name: 'User Two',
    avatarUrl: 'https://example.com/avatar2.jpg',
    passwordHash: 'hash2',
    emailVerified: false,
    phoneVerified: true,
    role: UserRole.ADMIN,
    referredById: '1',
    deletedAt: null,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

// DTOs
export const fullCreateUserDto: CreateUserDto = {
  email: 'test@example.com',
  phone: '+1234567890',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  referralCode: 'REF123',
};

export const minimalCreateUserDto: CreateUserDto = {
  email: 'minimal@example.com',
};

export const fullUpdateUserDto: UpdateUserDto = {
  name: 'Jane Doe',
  avatarUrl: 'https://example.com/new-avatar.jpg',
};

export const partialUpdateUserDto: UpdateUserDto = {
  name: 'Jane Doe',
  avatarUrl: undefined,
};

export const emptyUpdateUserDto: UpdateUserDto = {};

// Expected responses
export const expectedUserResponse: UserResponseDto = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'user@example.com',
  phone: '+1234567890',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  emailVerified: true,
  phoneVerified: false,
  role: UserRole.USER,
  referredById: '456e4567-e89b-12d3-a456-426614174000',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
};

export const expectedUserWithUndefined: UserResponseDto = {
  ...expectedUserResponse,
  phone: undefined,
  name: undefined,
  avatarUrl: undefined,
  referredById: undefined,
};
