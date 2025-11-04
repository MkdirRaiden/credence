// __tests__/unit/features/users/users.controller.spec.ts
import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/services/users.service';
import {
  fullCreateUserDto,
  fullUpdateUserDto,
  expectedUserResponse,
  mockPublicContext,
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
      findByEmailForAuth: jest.fn(),
    } as any;

    controller = new UsersController(service);
  });

  describe('create', () => {
    it('calls service.create with DTO', async () => {
      service.create.mockResolvedValue(expectedUserResponse as any);

      const result = await controller.create(fullCreateUserDto);

      expect(service.create).toHaveBeenCalledWith(fullCreateUserDto);
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findAll', () => {
    it('calls service.findAll with query and context', async () => {
      const mockResponse = [expectedUserResponse];
      service.findAll.mockResolvedValue(mockResponse as any);

      const query = { skip: 0, take: 10 };
      const result = await controller.findAll(query as any, mockPublicContext);

      expect(service.findAll).toHaveBeenCalledWith({
        ...mockPublicContext,
        skip: query.skip,
        take: query.take,
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('calls service.findById with id and context', async () => {
      service.findById.mockResolvedValue(expectedUserResponse as any);

      const result = await controller.findById(
        '550e8400-e29b-41d4-a716-446655440000',
        mockPublicContext,
      );

      expect(service.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        mockPublicContext,
      );
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findByEmail', () => {
    it('calls service.findByEmail with email and context', async () => {
      service.findByEmail.mockResolvedValue(expectedUserResponse as any);

      const result = await controller.findByEmail(
        'user@example.com',
        mockPublicContext,
      );

      expect(service.findByEmail).toHaveBeenCalledWith(
        'user@example.com',
        mockPublicContext,
      );
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('findByPhone', () => {
    it('calls service.findByPhone with phone and context', async () => {
      service.findByPhone.mockResolvedValue(expectedUserResponse as any);

      const result = await controller.findByPhone(
        '+1234567890',
        mockPublicContext,
      );

      expect(service.findByPhone).toHaveBeenCalledWith(
        '+1234567890',
        mockPublicContext,
      );
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('update', () => {
    it('calls service.update with id and DTO', async () => {
      service.update.mockResolvedValue(expectedUserResponse as any);

      const result = await controller.update(
        '550e8400-e29b-41d4-a716-446655440000',
        fullUpdateUserDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        fullUpdateUserDto,
      );
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('remove', () => {
    it('calls service.remove with id', async () => {
      const mockDeleteResponse = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        deletedAt: new Date(),
      };
      service.remove.mockResolvedValue(mockDeleteResponse as any);

      const result = await controller.remove(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(service.remove).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
      expect(result).toEqual(mockDeleteResponse);
    });
  });
});
