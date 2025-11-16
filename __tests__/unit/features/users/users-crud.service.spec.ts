// __tests__/unit/features/users/user-crud.service.spec.ts
import { UsersCrudService } from '@/features/users/services';
import { UsersCrudRepository } from '@/features/users/repositories';
import { LoggerService } from '@/logger/services';
import {
  fullCreateUserDto,
  minimalCreateUserDto,
  fullUpdateUserDto,
  mockUser,
} from './__fixtures__/users.fixtures';

describe('UserCrudService', () => {
  let service: UsersCrudService;
  let repo: jest.Mocked<UsersCrudRepository>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;

    service = new UsersCrudService(repo, logger);
  });

  it('create logs and delegates to repository.create, then maps to UserResponseDto', async () => {
    repo.create.mockResolvedValue(mockUser as any);

    const result = await service.create({
      ...fullCreateUserDto,
      passwordHash: 'hashed_pw',
    });

    // logging
    expect(logger.log).toHaveBeenCalledWith(
      `Creating user: ${fullCreateUserDto.email}`,
      'User',
    );
    expect(logger.log).toHaveBeenCalledWith(
      `User created with ID: ${mockUser.id}`,
      'User',
    );

    // repository call (UsersMapper.toCreateInput is used internally)
    expect(repo.create).toHaveBeenCalledWith({
      email: fullCreateUserDto.email,
      phone: fullCreateUserDto.phone,
      name: fullCreateUserDto.name,
      avatarUrl: fullCreateUserDto.avatarUrl,
      passwordHash: 'hashed_pw',
    });

    // mapping strips passwordHash
    expect(result.id).toBe(mockUser.id);
    expect((result as any).passwordHash).toBeUndefined();
  });

  it('create works with minimal dto', async () => {
    repo.create.mockResolvedValue({
      ...mockUser,
      email: minimalCreateUserDto.email,
      phone: null,
      name: null,
      avatarUrl: null,
    } as any);

    const result = await service.create(minimalCreateUserDto as any);

    expect(repo.create).toHaveBeenCalledWith({
      email: minimalCreateUserDto.email,
      phone: undefined,
      name: undefined,
      avatarUrl: undefined,
      passwordHash: undefined,
    });
    expect(result.email).toBe(minimalCreateUserDto.email);
  });

  it('update logs, delegates to repository.update and maps to UserResponseDto', async () => {
    repo.update.mockResolvedValue({
      ...mockUser,
      name: fullUpdateUserDto.name,
      avatarUrl: fullUpdateUserDto.avatarUrl,
    } as any);

    const result = await service.update(mockUser.id, fullUpdateUserDto);

    expect(logger.log).toHaveBeenCalledWith(
      `Updating user: ${mockUser.id}`,
      'User',
    );
    expect(logger.log).toHaveBeenCalledWith(
      `User updated: ${mockUser.id}`,
      'User',
    );

    expect(repo.update).toHaveBeenCalledWith(mockUser.id, {
      ...fullUpdateUserDto,
    });
    expect(result.name).toBe(fullUpdateUserDto.name);
    expect(result.avatarUrl).toBe(fullUpdateUserDto.avatarUrl);
  });

  it('remove logs and delegates to repository.softDelete, returning DeletedResourceDto', async () => {
    const deleted = { id: mockUser.id, deletedAt: new Date() };
    repo.softDelete.mockResolvedValue(deleted as any);

    const result = await service.remove(mockUser.id);

    expect(logger.log).toHaveBeenCalledWith(
      `Soft deleting user: ${mockUser.id}`,
      'User',
    );
    expect(logger.log).toHaveBeenCalledWith(
      `User soft deleted: ${mockUser.id}`,
      'User',
    );

    expect(repo.softDelete).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual(deleted);
  });
});
