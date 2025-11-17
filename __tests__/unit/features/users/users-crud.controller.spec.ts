// __tests__/unit/features/users/users-crud.controller.spec.ts
import { UsersCrudController } from '@/features/users/controllers/users-crud.controller';
import { UsersCrudService } from '@/features/users/services';
import {
  fullCreateUserDto,
  fullUpdateUserDto,
  mockUser,
  mockAdminUser,
  expectedUserResponse,
} from './__fixtures__/users.fixtures';
import { UserRole } from '@prisma/client';
import { UserAccessForbiddenException } from '@/common/exceptions';

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

  it('create delegates to crudService.create and returns result', async () => {
    crudService.create.mockResolvedValue(expectedUserResponse as any);

    const result = await controller.create(fullCreateUserDto);

    expect(crudService.create).toHaveBeenCalledWith(fullCreateUserDto);
    expect(result).toEqual(expectedUserResponse);
  });

  it('update allows self update', async () => {
    crudService.update.mockResolvedValue(expectedUserResponse as any);

    const result = await controller.update(mockUser.id, fullUpdateUserDto, {
      ...expectedUserResponse,
      id: mockUser.id,
      role: UserRole.USER,
    } as any);

    expect(crudService.update).toHaveBeenCalledWith(
      mockUser.id,
      fullUpdateUserDto,
    );
    expect(result).toEqual(expectedUserResponse);
  });

  it('update allows admin to update another user', async () => {
    crudService.update.mockResolvedValue(expectedUserResponse as any);

    const result = await controller.update(mockUser.id, fullUpdateUserDto, {
      ...expectedUserResponse,
      id: mockAdminUser.id,
      role: UserRole.ADMIN,
    } as any);

    expect(crudService.update).toHaveBeenCalledWith(
      mockUser.id,
      fullUpdateUserDto,
    );
    expect(result).toEqual(expectedUserResponse);
  });

  it('update throws UserAccessForbiddenException when non-owner non-admin', async () => {
    await expect(
      controller.update(mockUser.id, fullUpdateUserDto, {
        ...expectedUserResponse,
        id: 'someone-else',
        role: UserRole.USER,
      } as any),
    ).rejects.toBeInstanceOf(UserAccessForbiddenException);

    expect(crudService.update).not.toHaveBeenCalled();
  });

  it('remove allows self delete and calls crudService.remove', async () => {
    const deleted = { id: mockUser.id, deleted: true };
    crudService.remove.mockResolvedValue(deleted as any);

    const result = await controller.remove(mockUser.id, {
      ...expectedUserResponse,
      id: mockUser.id,
      role: UserRole.USER,
    } as any);

    expect(crudService.remove).toHaveBeenCalledWith(mockUser.id);
    expect(result).toEqual(deleted);
  });
});
