// __tests__/unit/features/users/users-auth.service.spec.ts
import { UsersAuthService } from '@/features/users/services';
import { UsersAuthRepository } from '@/features/users/repositories';
import { LoggerService } from '@/logger/services';
import { mockUser } from './__fixtures__/users.fixtures';

describe('UsersAuthService', () => {
  let service: UsersAuthService;
  let repo: jest.Mocked<UsersAuthRepository>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    repo = {
      findByEmailForAuth: jest.fn(),
      findByUsernameForAuth: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;

    service = new UsersAuthService(repo, logger);
  });

  it('findByEmailForAuth delegates to repo and returns full user (including passwordHash)', async () => {
    repo.findByEmailForAuth.mockResolvedValue(mockUser as any);

    const result = await service.findByEmailForAuth(mockUser.email);

    expect(repo.findByEmailForAuth).toHaveBeenCalledWith(mockUser.email);
    expect(result).toBe(mockUser);
    expect(result.passwordHash).toBe(mockUser.passwordHash);
  });

  it('findByUsernameForAuth delegates to repo and returns full user (including passwordHash)', async () => {
    repo.findByUsernameForAuth.mockResolvedValue(mockUser as any);

    const result = await service.findByUsernameForAuth(mockUser.username!);

    expect(repo.findByUsernameForAuth).toHaveBeenCalledWith(mockUser.username);
    expect(result).toBe(mockUser);
    expect(result.passwordHash).toBe(mockUser.passwordHash);
  });
});
