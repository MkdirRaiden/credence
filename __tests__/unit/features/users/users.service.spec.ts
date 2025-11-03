// __tests__/unit/features/users/users.service.spec.ts
import { UsersService } from '@/features/users/users.service';
import { UsersRepository } from '@/features/users/users.repository';
import { LoggerService } from '@/logger/logger.service';
import {
  mockUser,
  mockUserList,
  fullCreateUserDto,
  fullUpdateUserDto,
  expectedUserResponse,
  mockPublicContext,
} from './__fixtures__/users.fixtures';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      findByEmailForAuth: jest.fn(),
    } as any;

    logger = { log: jest.fn() } as any;

    service = new UsersService(repository, logger);
  });

  describe('create', () => {
    it('calls repository.create and returns mapped response', async () => {
      repository.create.mockResolvedValue(mockUser);

      const result = await service.create(fullCreateUserDto);

      expect(repository.create).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalled();
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findAll', () => {
    it('calls repository.findAll with context', async () => {
      repository.findAll.mockResolvedValue(mockUserList);

      const result = await service.findAll(mockPublicContext);

      expect(repository.findAll).toHaveBeenCalledWith(mockPublicContext);
      expect(result).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('calls repository.findById with id and context', async () => {
      repository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id, mockPublicContext);

      expect(repository.findById).toHaveBeenCalledWith(
        mockUser.id,
        mockPublicContext,
      );
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findByEmail', () => {
    it('calls repository.findByEmail with email and context', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail(
        'user@example.com',
        mockPublicContext,
      );

      expect(repository.findByEmail).toHaveBeenCalledWith(
        'user@example.com',
        mockPublicContext,
      );
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findByPhone', () => {
    it('calls repository.findByPhone with phone and context', async () => {
      repository.findByPhone.mockResolvedValue(mockUser);

      const result = await service.findByPhone(
        '+1234567890',
        mockPublicContext,
      );

      expect(repository.findByPhone).toHaveBeenCalledWith(
        '+1234567890',
        mockPublicContext,
      );
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('update', () => {
    it('calls repository.update with id and DTO', async () => {
      repository.update.mockResolvedValue(mockUser);

      const result = await service.update(mockUser.id, fullUpdateUserDto);

      expect(repository.update).toHaveBeenCalledWith(
        mockUser.id,
        fullUpdateUserDto,
      );
      expect(logger.log).toHaveBeenCalled();
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('remove', () => {
    it('calls repository.softDelete with id', async () => {
      repository.softDelete.mockResolvedValue({
        id: mockUser.id,
        deletedAt: new Date(),
      });

      const result = await service.remove(mockUser.id);

      expect(repository.softDelete).toHaveBeenCalledWith(mockUser.id);
      expect(logger.log).toHaveBeenCalled();
    });
  });

  describe('findByEmailForAuth', () => {
    it('calls repository.findByEmailForAuth and returns full user', async () => {
      repository.findByEmailForAuth.mockResolvedValue(mockUser);

      const result = await service.findByEmailForAuth('user@example.com');

      expect(repository.findByEmailForAuth).toHaveBeenCalledWith(
        'user@example.com',
      );
      expect(result.passwordHash).toBeDefined();
    });
  });
});
