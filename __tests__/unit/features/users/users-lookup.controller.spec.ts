// __tests__/unit/features/users/users-lookup.controller.spec.ts
import { UsersLookupController } from '@/features/users/controllers/users-lookup.controller';
import { UsersLookupService } from '@/features/users/services';
import {
  mockUser,
  mockUserList,
  mockPublicContext,
  mockAdminContext,
} from './__fixtures__/users.fixtures';

describe('UsersLookupController', () => {
  let controller: UsersLookupController;
  let lookupService: jest.Mocked<UsersLookupService>;

  beforeEach(() => {
    lookupService = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      findAll: jest.fn(),
    } as any;

    controller = new UsersLookupController(lookupService);
  });

  it('findById delegates to lookupService.findById with context', async () => {
    lookupService.findById.mockResolvedValue(mockUser as any);

    const result = await controller.findById(mockUser.id, mockAdminContext);

    expect(lookupService.findById).toHaveBeenCalledWith(
      mockUser.id,
      mockAdminContext,
    );
    expect(result).toEqual(mockUser);
  });

  it('findByUsername delegates to lookupService.findByUsername with context', async () => {
    lookupService.findByUsername.mockResolvedValue(mockUser as any);

    const result = await controller.findByUsername(
      mockUser.username!,
      mockPublicContext,
    );

    expect(lookupService.findByUsername).toHaveBeenCalledWith(
      mockUser.username,
      mockPublicContext,
    );
    expect(result).toEqual(mockUser);
  });

  it('findByEmail delegates to lookupService.findByEmail with context', async () => {
    lookupService.findByEmail.mockResolvedValue(mockUser as any);

    const result = await controller.findByEmail(
      mockUser.email,
      mockAdminContext,
    );

    expect(lookupService.findByEmail).toHaveBeenCalledWith(
      mockUser.email,
      mockAdminContext,
    );
    expect(result).toEqual(mockUser);
  });

  it('findByPhone delegates to lookupService.findByPhone with context', async () => {
    lookupService.findByPhone.mockResolvedValue(mockUser as any);

    const result = await controller.findByPhone(
      mockUser.phone!,
      mockAdminContext,
    );

    expect(lookupService.findByPhone).toHaveBeenCalledWith(
      mockUser.phone,
      mockAdminContext,
    );
    expect(result).toEqual(mockUser);
  });

  it('findAll delegates to lookupService.findAll with merged query + context', async () => {
    const query = { skip: 0, take: 10 };
    lookupService.findAll.mockResolvedValue(mockUserList as any);

    const result = await controller.findAll(query, mockPublicContext);

    expect(lookupService.findAll).toHaveBeenCalledWith({
      ...mockPublicContext,
      skip: query.skip,
      take: query.take,
    });
    expect(result).toEqual(mockUserList);
  });
});
