// __tests__/unit/features/users/users.mapper.spec.ts
import {
  toCreateInput,
  toUpdateInput,
  toResponseDto,
  toResponseDtoList,
} from '@/features/users/users.mapper';
import { UserRole } from '@prisma/client';
import {
  mockUser,
  mockUserWithNulls,
  mockAdminUser,
  mockUserList,
  fullCreateUserDto,
  minimalCreateUserDto,
  fullUpdateUserDto,
  partialUpdateUserDto,
  emptyUpdateUserDto,
  expectedUserResponse,
} from './__fixtures__/users.fixtures';

describe('Users Mapper', () => {
  describe('toCreateInput', () => {
    it('maps all fields from CreateUserDto to Prisma input', () => {
      const result = toCreateInput(fullCreateUserDto);

      expect(result).toEqual({
        email: 'test@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
    });

    it('maps only required email field when optionals are undefined', () => {
      const result = toCreateInput(minimalCreateUserDto);

      expect(result).toEqual({
        email: 'minimal@example.com',
        phone: undefined,
        name: undefined,
        avatarUrl: undefined,
      });
    });
  });

  describe('toUpdateInput', () => {
    it('includes only defined fields', () => {
      const result = toUpdateInput(fullUpdateUserDto);

      expect(result).toEqual({
        name: 'Jane Doe',
        avatarUrl: 'https://example.com/new-avatar.jpg',
      });
    });

    it('filters out undefined fields', () => {
      const result = toUpdateInput(partialUpdateUserDto);

      expect(result).toEqual({ name: 'Jane Doe' });
      expect(result).not.toHaveProperty('avatarUrl');
    });

    it('returns empty object when all fields are undefined', () => {
      const result = toUpdateInput(emptyUpdateUserDto);

      expect(result).toEqual({});
    });
  });

  describe('toResponseDto', () => {
    it('maps User entity to UserResponseDto with all fields', () => {
      const result = toResponseDto(mockUser);

      expect(result).toEqual(expectedUserResponse);
    });

    it('does not expose sensitive fields', () => {
      const result = toResponseDto(mockUser);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('deletedAt');
    });

    it('converts null optional fields to undefined', () => {
      const result = toResponseDto(mockUserWithNulls);

      expect(result.phone).toBeUndefined();
      expect(result.name).toBeUndefined();
      expect(result.avatarUrl).toBeUndefined();
      expect(result.referredById).toBeUndefined();
    });

    it('preserves ADMIN role correctly', () => {
      const result = toResponseDto(mockAdminUser);

      expect(result.role).toBe(UserRole.ADMIN);
    });
  });

  describe('toResponseDtoList', () => {
    it('maps array of User entities to array of UserResponseDto', () => {
      const result = toResponseDtoList(mockUserList);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[0].email).toBe('user1@example.com');
      expect(result[0]).not.toHaveProperty('passwordHash');
      expect(result[1].id).toBe('2');
      expect(result[1].role).toBe(UserRole.ADMIN);
    });

    it('returns empty array when given empty array', () => {
      const result = toResponseDtoList([]);

      expect(result).toEqual([]);
    });
  });
});
