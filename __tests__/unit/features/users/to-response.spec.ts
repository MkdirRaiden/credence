// __tests__/unit/features/users/mappers/to-response.spec.ts
import { toResponseDto, toResponseDtoList } from '@/features/users/mappers';
import {
  mockUser,
  mockUserList,
  expectedUserResponse,
} from './__fixtures__/users.fixtures';

describe('User mappers - to-response', () => {
  it('maps a single user and strips passwordHash', () => {
    const result = toResponseDto(mockUser);

    expect(result).toMatchObject(expectedUserResponse);
    expect((result as any).passwordHash).toBeUndefined();
  });

  it('maps a list of users', () => {
    const result = toResponseDtoList(mockUserList);

    expect(result).toHaveLength(mockUserList.length);
    expect(result[0]).toMatchObject({ id: mockUser.id });
    expect((result[0] as any).passwordHash).toBeUndefined();
  });
});
