// __tests__/unit/features/users/__fixtures__/users.fixtures.ts
import { User, UserRole, AuthProvider } from '@prisma/client';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@/features/users/dtos';
import { FieldSelectorContext } from '@/common/interfaces';

export const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'user@example.com',
  username: 'hello',
  phone: '+1234567890',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  passwordHash: 'hashed_password',
  emailVerified: true,
  phoneVerified: false,
  role: UserRole.USER,
  authProvider: AuthProvider.LOCAL,
  lastLoginAt: new Date('2024-01-01T12:00:00.000Z'),
  referredById: '660e8400-e29b-41d4-a716-446655440000',
  deletedAt: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
};

export const mockAdminUser: User = {
  ...mockUser,
  id: '770e8400-e29b-41d4-a716-446655440000',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
  lastLoginAt: new Date('2024-01-02T12:00:00.000Z'),
};

export const mockUserList: User[] = [mockUser, mockAdminUser];

export const fullCreateUserDto: CreateUserDto = {
  email: 'test@example.com',
  phone: '+1234567890',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
};

export const minimalCreateUserDto: CreateUserDto = {
  email: 'minimal@example.com',
};

export const fullUpdateUserDto: UpdateUserDto = {
  name: 'Jane Doe',
  avatarUrl: 'https://example.com/new-avatar.jpg',
};

export const expectedUserResponse: Partial<UserResponseDto> = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'user@example.com',
  phone: '+1234567890',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  emailVerified: true,
  phoneVerified: false,
  role: UserRole.USER,
  referredById: '660e8400-e29b-41d4-a716-446655440000',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
};

export const mockPublicContext: FieldSelectorContext = {
  level: 'public',
  skip: 0,
  take: 10,
};

export const mockAdminContext: FieldSelectorContext = {
  level: 'admin',
  requesterId: '770e8400-e29b-41d4-a716-446655440000',
  skip: 0,
  take: 10,
};
