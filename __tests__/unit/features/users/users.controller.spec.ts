// __tests__/unit/features/users/users.controller.spec.ts
import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';
import {
  fullCreateUserDto,
  fullUpdateUserDto,
  expectedUserResponse,
  mockUserList,
} from './__fixtures__/users.fixtures';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      emailExists: jest.fn(),
      phoneExists: jest.fn(),
    } as any;

    controller = new UsersController(service);
  });

  describe('create', () => {
    it('delegates to service with DTO', async () => {
      service.create.mockResolvedValue(expectedUserResponse);

      const result = await controller.create(fullCreateUserDto);

      expect(service.create).toHaveBeenCalledWith(fullCreateUserDto);
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findAll', () => {
    it('passes pagination params to service', async () => {
      service.findAll.mockResolvedValue(
        mockUserList.map((u) => ({
          id: u.id,
          email: u.email,
          phone: u.phone ?? undefined,
          name: u.name ?? undefined,
          avatarUrl: u.avatarUrl ?? undefined,
          emailVerified: u.emailVerified,
          phoneVerified: u.phoneVerified,
          role: u.role,
          referredById: u.referredById ?? undefined,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        })),
      );

      const result = await controller.findAll(20, 50);

      expect(service.findAll).toHaveBeenCalledWith(20, 50);
      expect(result).toHaveLength(2);
    });

    it('uses default pagination when not provided', async () => {
      service.findAll.mockResolvedValue([]);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(0, 10);
    });
  });

  describe('findById', () => {
    it('delegates to service with id', async () => {
      service.findById.mockResolvedValue(expectedUserResponse);

      const result = await controller.findById('123');

      expect(service.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findByEmail', () => {
    it('delegates to service with email', async () => {
      service.findByEmail.mockResolvedValue(expectedUserResponse);

      const result = await controller.findByEmail('user@example.com');

      expect(service.findByEmail).toHaveBeenCalledWith('user@example.com');
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findByPhone', () => {
    it('delegates to service with phone', async () => {
      service.findByPhone.mockResolvedValue(expectedUserResponse);

      const result = await controller.findByPhone('+1234567890');

      expect(service.findByPhone).toHaveBeenCalledWith('+1234567890');
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('update', () => {
    it('delegates to service with id and DTO', async () => {
      service.update.mockResolvedValue(expectedUserResponse);

      const result = await controller.update('123', fullUpdateUserDto);

      expect(service.update).toHaveBeenCalledWith('123', fullUpdateUserDto);
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('remove', () => {
    it('delegates to service with id', async () => {
      service.remove.mockResolvedValue(expectedUserResponse);

      const result = await controller.remove('123');

      expect(service.remove).toHaveBeenCalledWith('123');
      expect(result).toEqual(expectedUserResponse);
    });
  });
});
