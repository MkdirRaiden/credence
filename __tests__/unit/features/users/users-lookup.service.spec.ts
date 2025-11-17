// __tests__/unit/features/users/user-lookup.service.spec.ts
import { UsersLookupService } from '@/features/users/services';
import { UsersLookupRepository } from '@/features/users/repositories';
import {
  mockUser,
  mockUserList,
  mockPublicContext,
  mockAdminContext,
} from './__fixtures__/users.fixtures';
import { toResponseDto, toResponseDtoList } from '@/features/users/mappers';

describe('UsersLookupService', () => {
  let service: UsersLookupService;
  let repo: jest.Mocked<UsersLookupRepository>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      findAll: jest.fn(),
    } as any;

    service = new UsersLookupService(repo);
  });

  it('findById delegates to repo.findById with context and maps to DTO', async () => {
    repo.findById.mockResolvedValue(mockUser as any);

    const result = await service.findById(mockUser.id, mockAdminContext);

    expect(repo.findById).toHaveBeenCalledWith(mockUser.id, mockAdminContext);

    const expected = toResponseDto(mockUser as any);
    expect(result).toEqual(expected);
    expect((result as any).passwordHash).toBeUndefined();
    expect((result as any).deletedAt).toBeUndefined();
  });

  it('findByUsername delegates to repo.findByUsername with context and maps to DTO', async () => {
    repo.findByUsername.mockResolvedValue(mockUser as any);

    const result = await service.findByUsername(
      mockUser.username!,
      mockPublicContext,
    );

    expect(repo.findByUsername).toHaveBeenCalledWith(
      mockUser.username,
      mockPublicContext,
    );

    const expected = toResponseDto(mockUser as any);
    expect(result).toEqual(expected);
    expect((result as any).passwordHash).toBeUndefined();
    expect((result as any).deletedAt).toBeUndefined();
  });

  it('findByEmail delegates to repo.findByEmail with context and maps to DTO', async () => {
    repo.findByEmail.mockResolvedValue(mockUser as any);

    const result = await service.findByEmail(mockUser.email, mockAdminContext);

    expect(repo.findByEmail).toHaveBeenCalledWith(
      mockUser.email,
      mockAdminContext,
    );

    const expected = toResponseDto(mockUser as any);
    expect(result).toEqual(expected);
    expect((result as any).passwordHash).toBeUndefined();
    expect((result as any).deletedAt).toBeUndefined();
  });

  it('findByPhone delegates to repo.findByPhone with context and maps to DTO', async () => {
    repo.findByPhone.mockResolvedValue(mockUser as any);

    const result = await service.findByPhone(
      mockUser.phone!,
      mockAdminContext,
    );

    expect(repo.findByPhone).toHaveBeenCalledWith(
      mockUser.phone,
      mockAdminContext,
    );

    const expected = toResponseDto(mockUser as any);
    expect(result).toEqual(expected);
    expect((result as any).passwordHash).toBeUndefined();
    expect((result as any).deletedAt).toBeUndefined();
  });

  it('findAll delegates to repo.findAll and maps to DTOs', async () => {
    const contextWithLargeTake = { ...mockPublicContext, take: 10_000 };
    repo.findAll.mockResolvedValue(mockUserList as any);

    const result = await service.findAll(contextWithLargeTake);

    expect(repo.findAll).toHaveBeenCalledWith(contextWithLargeTake);

    const expected = toResponseDtoList(mockUserList as any);

    expect(result).toEqual(expected);
    expect((result[0] as any).passwordHash).toBeUndefined();
    expect((result[0] as any).deletedAt).toBeUndefined();
  });
});
