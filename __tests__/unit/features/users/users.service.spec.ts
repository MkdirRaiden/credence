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
      existsByEmail: jest.fn(),
      existsByPhone: jest.fn(),
    } as any;

    logger = { log: jest.fn() } as any;

    service = new UsersService(repository, logger);
  });

  describe('create', () => {
    it('creates user, logs, and returns mapped response', async () => {
      repository.create.mockResolvedValue(mockUser);

      const result = await service.create(fullCreateUserDto);

      expect(repository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      expect(logger.log).toHaveBeenCalledTimes(2);
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findAll', () => {
    it('returns paginated list with default and custom params', async () => {
      repository.findAll.mockResolvedValue(mockUserList);

      const defaultResult = await service.findAll();
      expect(repository.findAll).toHaveBeenCalledWith(0, 10);
      expect(defaultResult).toHaveLength(2);

      const customResult = await service.findAll(20, 50);
      expect(repository.findAll).toHaveBeenCalledWith(20, 50);
    });
  });

  describe('findById', () => {
    it('delegates to repository and maps response', async () => {
      repository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(repository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findByEmail', () => {
    it('delegates to repository and maps response', async () => {
      repository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('user@example.com');

      expect(repository.findByEmail).toHaveBeenCalledWith('user@example.com');
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findByPhone', () => {
    it('delegates to repository and maps response', async () => {
      repository.findByPhone.mockResolvedValue(mockUser);

      const result = await service.findByPhone('+1234567890');

      expect(repository.findByPhone).toHaveBeenCalledWith('+1234567890');
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('update', () => {
    it('updates user with logging', async () => {
      repository.update.mockResolvedValue(mockUser);

      const result = await service.update(mockUser.id, fullUpdateUserDto);

      expect(repository.update).toHaveBeenCalledWith(mockUser.id, {
        name: 'Jane Doe',
        avatarUrl: 'https://example.com/new-avatar.jpg',
      });
      expect(logger.log).toHaveBeenCalledTimes(2);
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('remove', () => {
    it('soft deletes user with logging', async () => {
      repository.softDelete.mockResolvedValue(mockUser);

      const result = await service.remove(mockUser.id);

      expect(repository.softDelete).toHaveBeenCalledWith(mockUser.id);
      expect(logger.log).toHaveBeenCalledTimes(2);
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('existence checks', () => {
    it('checks email existence', async () => {
      repository.existsByEmail
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      expect(await service.emailExists('existing@example.com')).toBe(true);
      expect(await service.emailExists('new@example.com')).toBe(false);
    });

    it('checks phone existence', async () => {
      repository.existsByPhone
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      expect(await service.phoneExists('+1234567890')).toBe(true);
      expect(await service.phoneExists('+9999999999')).toBe(false);
    });
  });
});
