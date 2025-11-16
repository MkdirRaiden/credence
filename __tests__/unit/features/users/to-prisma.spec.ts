// __tests__/unit/features/users/to-prisma.spec.ts
import { toCreateInput, toUpdateInput } from '@/features/users/mappers';
import {
  fullCreateUserDto,
  minimalCreateUserDto,
  fullUpdateUserDto,
} from './__fixtures__/users.fixtures';

describe('User mappers - to-prisma', () => {
  it('maps full CreateUserDto', () => {
    const result = toCreateInput({
      ...fullCreateUserDto,
      passwordHash: 'hashed',
    });

    expect(result).toEqual({
      email: fullCreateUserDto.email,
      phone: fullCreateUserDto.phone,
      name: fullCreateUserDto.name,
      avatarUrl: fullCreateUserDto.avatarUrl,
      passwordHash: 'hashed',
    });
  });

  it('maps minimal CreateUserDto', () => {
    const result = toCreateInput(minimalCreateUserDto);

    expect(result.email).toBe(minimalCreateUserDto.email);
  });

  it('filters undefined fields in UpdateUserDto', () => {
    const result = toUpdateInput(fullUpdateUserDto);
    expect(result).toEqual(fullUpdateUserDto);
  });
});
