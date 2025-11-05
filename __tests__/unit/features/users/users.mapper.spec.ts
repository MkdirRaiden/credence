// __tests__/unit/features/users/users.mapper.spec.ts
import {
  toCreateInput,
  toUpdateInput,
  toResponseDto,
  toResponseDtoList,
} from '@/features/users/mappers';
import {
  mockUser,
  mockAdminUser,
  mockUserList,
  fullCreateUserDto,
  minimalCreateUserDto,
  fullUpdateUserDto,
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
        passwordHash: undefined,
      });
    });

    it('maps minimal DTO with only email', () => {
      const result = toCreateInput(minimalCreateUserDto);

      expect(result.email).toBe('minimal@example.com');
      expect(result.phone).toBeUndefined();
      expect(result.name).toBeUndefined();
    });

    it('includes passwordHash when provided (for auth)', () => {
      const result = toCreateInput({
        ...fullCreateUserDto,
        passwordHash: 'hashed_pw',
      });

      expect(result.passwordHash).toBe('hashed_pw');
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
      const result = toUpdateInput({ name: 'Jane Doe' });

      expect(result).toEqual({ name: 'Jane Doe' });
      expect(result).not.toHaveProperty('avatarUrl');
    });

    it('returns empty object when empty DTO', () => {
      const result = toUpdateInput({});

      expect(result).toEqual({});
    });
  });

  describe('toResponseDto', () => {
    it('maps User entity to UserResponseDto', () => {
      const result = toResponseDto(mockUser);

      expect(result.id).toBe(expectedUserResponse.id);
      expect(result.email).toBe(expectedUserResponse.email);
      expect(result.name).toBe(expectedUserResponse.name);
    });

    it('excludes sensitive fields (passwordHash, deletedAt)', () => {
      const result = toResponseDto(mockUser);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('deletedAt');
    });

    it('preserves role correctly', () => {
      const result = toResponseDto(mockAdminUser);

      expect(result.role).toBe('ADMIN');
    });
  });

  describe('toResponseDtoList', () => {
    it('maps array of Users to array of UserResponseDtos', () => {
      const result = toResponseDtoList(mockUserList);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(mockUserList[0].id);
      expect(result[1].role).toBe('ADMIN');
    });

    it('returns empty array for empty input', () => {
      const result = toResponseDtoList([]);

      expect(result).toEqual([]);
    });
  });
});
