// __tests__/unit/features/users/users-crud.controller.spec.ts
import { UsersCrudController } from '@/features/users/controllers/users-crud.controller';
import { UsersCrudService } from '@/features/users/services';
import {
  fullCreateUserDto,
  fullUpdateUserDto,
  mockUser,
  expectedUserResponse,
} from './__fixtures__/users.fixtures';

describe('UsersCrudController', () => {
  let controller: UsersCrudController;
  let crudService: jest.Mocked<UsersCrudService>;

  beforeEach(() => {
    crudService = {
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    controller = new UsersCrudController(crudService);
  });

  describe('create', () => {
    it('delegates to crudService.create and returns result', async () => {
      crudService.create.mockResolvedValue(expectedUserResponse as any);

      const result = await controller.create(fullCreateUserDto);

      expect(crudService.create).toHaveBeenCalledWith(fullCreateUserDto);
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('update', () => {
    it('calls crudService.update (ownership checked by guard)', async () => {
      crudService.update.mockResolvedValue(expectedUserResponse as any);

      const result = await controller.update(mockUser.id, fullUpdateUserDto);

      expect(crudService.update).toHaveBeenCalledWith(
        mockUser.id,
        fullUpdateUserDto,
      );
      expect(result).toEqual(expectedUserResponse);
    });
  });

  describe('remove', () => {
    it('calls crudService.remove (ownership checked by guard)', async () => {
      const deleted = { id: mockUser.id, deletedAt: new Date() };
      crudService.remove.mockResolvedValue(deleted as any);

      const result = await controller.remove(mockUser.id);

      expect(crudService.remove).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(deleted);
    });
  });
});
