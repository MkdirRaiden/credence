// __tests__/unit/features/auth/credentials.service.spec.ts
import { CredentialsService } from '@/features/auth/services';
import { BaseAuthService } from '@/features/users/contracts';
import * as authHelpers from '@/features/auth/helpers';
import { UserResponseDto } from '@/features/auth/dtos';

// Mock helpers module once
jest.mock('@/features/auth/helpers', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  generateTokens: jest.fn(),
  extractLoginIdentifier: jest.fn(),
  verifyJwtToken: jest.fn(),
}));

const mockedHelpers = authHelpers as jest.Mocked<typeof authHelpers>;

describe('CredentialsService', () => {
  let service: CredentialsService;
  let authService: jest.Mocked<BaseAuthService>;

  const userWithHash = {
    id: 'user-id',
    email: 'user@example.com',
    username: 'user',
    role: 'USER',
    passwordHash: 'hashed_pw',
  } as any;

  beforeEach(() => {
    authService = {
      findByEmailForAuth: jest.fn(),
      findByUsernameForAuth: jest.fn(),
    } as any;

    service = new CredentialsService(authService);
  });

  it('validates user by email and returns user without passwordHash on success', async () => {
    mockedHelpers.verifyPassword.mockResolvedValue(true);

    authService.findByEmailForAuth.mockResolvedValue(userWithHash);

    const result = await service.validate('user@example.com', 'plain_pw');

    expect(authService.findByEmailForAuth).toHaveBeenCalledWith(
      'user@example.com',
    );
    expect(authService.findByUsernameForAuth).not.toHaveBeenCalled();

    expect(mockedHelpers.verifyPassword).toHaveBeenCalledWith(
      'plain_pw',
      'hashed_pw',
    );

    expect(result).toMatchObject({
      id: 'user-id',
      email: 'user@example.com',
      username: 'user',
      role: 'USER',
    } satisfies Partial<UserResponseDto>);
    expect((result as any).passwordHash).toBeUndefined();
  });

  it('validates user by username when identifier has no @', async () => {
    mockedHelpers.verifyPassword.mockResolvedValue(true);

    authService.findByUsernameForAuth.mockResolvedValue(userWithHash);

    const result = await service.validate('user', 'plain_pw');

    expect(authService.findByUsernameForAuth).toHaveBeenCalledWith('user');
    expect(authService.findByEmailForAuth).not.toHaveBeenCalled();
    expect(result?.username).toBe('user');
  });

  it('returns null when user has no passwordHash', async () => {
    authService.findByEmailForAuth.mockResolvedValue({
      ...userWithHash,
      passwordHash: undefined,
    });

    const result = await service.validate('user@example.com', 'plain_pw');

    expect(result).toBeNull();
  });

  it('returns null when password is invalid', async () => {
    mockedHelpers.verifyPassword.mockResolvedValue(false);

    authService.findByEmailForAuth.mockResolvedValue(userWithHash);

    const result = await service.validate('user@example.com', 'wrong_pw');

    expect(result).toBeNull();
  });

  it('returns null when authService throws', async () => {
    authService.findByEmailForAuth.mockRejectedValue(new Error('DB error'));

    const result = await service.validate('user@example.com', 'plain_pw');

    expect(result).toBeNull();
  });
});
