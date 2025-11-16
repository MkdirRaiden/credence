// __tests__/unit/features/auth/auth.service.spec.ts
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';

import { AuthService } from '@/features/auth/services';
import { BaseCrudService, BaseLookupService } from '@/features/users/contracts';
import { BaseTokenService } from '@/features/refresh-tokens/contracts';
import { LoggerService } from '@/logger/services';
import * as helpers from '@/features/auth/helpers';
import {
  AuthResponseDto,
  RegisterDto,
  UserResponseDto,
  RefreshTokenDto,
} from '@/features/auth/dtos';

// Mock the whole helpers module once so we can configure its functions
jest.mock('@/features/auth/helpers', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  generateTokens: jest.fn(),
  extractLoginIdentifier: jest.fn(),
  verifyJwtToken: jest.fn(),
}));

const mockedHelpers = helpers as jest.Mocked<typeof helpers>;

describe('AuthService', () => {
  let service: AuthService;
  let crudService: jest.Mocked<BaseCrudService>;
  let lookupService: jest.Mocked<BaseLookupService>;
  let tokenService: jest.Mocked<BaseTokenService>;
  let jwtService: jest.Mocked<JwtService>;
  let logger: jest.Mocked<LoggerService>;

  const user: UserResponseDto = {
    id: 'user-id',
    email: 'user@example.com',
    username: 'user',
    name: 'User',
    avatarUrl: null as any,
    phone: null as any,
    emailVerified: false,
    phoneVerified: false,
    role: UserRole.USER,
    referredById: null as any,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    crudService = {
      create: jest.fn(),
    } as any;

    lookupService = {
      findById: jest.fn(),
    } as any;

    tokenService = {
      create: jest.fn(),
      verify: jest.fn(),
      revoke: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
      decode: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;

    service = new AuthService(
      crudService,
      lookupService,
      tokenService,
      jwtService,
      logger,
    );
  });

  describe('register', () => {
    it('hashes password, creates user via crudService and returns AuthResponseDto', async () => {
      const registerDto: RegisterDto = {
        email: 'user@example.com',
        password: 'Plain123!',
        username: 'user',
        name: 'User',
        avatarUrl: undefined as any,
        phone: undefined as any,
      };

      mockedHelpers.hashPassword.mockResolvedValue('hashed_pw');

      crudService.create.mockResolvedValue({
        ...user,
        passwordHash: 'hashed_pw',
      } as any);

      const authSpy = jest
        .spyOn<any, any>(service as any, 'createAuthResponse')
        .mockResolvedValue({
          accessToken: 'access',
          refreshToken: 'refresh',
          expiresIn: 900,
          tokenType: 'Bearer',
          user,
        } as AuthResponseDto);

      const result = await service.register(registerDto);

      expect(logger.log).toHaveBeenCalledWith(
        `Registering user: ${registerDto.email}`,
        'Auth',
      );
      expect(mockedHelpers.hashPassword).toHaveBeenCalledWith('Plain123!');
      expect(crudService.create).toHaveBeenCalledWith({
        email: 'user@example.com',
        username: 'user',
        name: 'User',
        avatarUrl: undefined,
        phone: undefined,
        passwordHash: 'hashed_pw',
      });
      expect(authSpy).toHaveBeenCalledWith(
        user.id,
        user.email,
        expect.objectContaining({ id: user.id }),
      );
      expect(result.accessToken).toBe('access');
      expect(result.user).toEqual(user);
    });
  });

  describe('login', () => {
    it('logs and returns AuthResponseDto via createAuthResponse', async () => {
      const authSpy = jest
        .spyOn<any, any>(service as any, 'createAuthResponse')
        .mockResolvedValue({
          accessToken: 'access',
          refreshToken: 'refresh',
          expiresIn: 900,
          tokenType: 'Bearer',
          user,
        } as AuthResponseDto);

      const result = await service.login(user);

      expect(logger.log).toHaveBeenCalledWith(
        `User logged in: ${user.id}`,
        'Auth',
      );
      expect(authSpy).toHaveBeenCalledWith(user.id, user.email, user);
      expect(result.accessToken).toBe('access');
    });
  });

  describe('refresh', () => {
    it('verifies, revokes, reloads user and returns new tokens', async () => {
      const refreshDto: RefreshTokenDto = {
        refreshToken: 'refresh_token',
      };

      mockedHelpers.verifyJwtToken.mockReturnValue({
        sub: user.id,
        email: user.email,
        username: user.username,
      } as any);

      tokenService.verify.mockResolvedValue(undefined);
      tokenService.revoke.mockResolvedValue(undefined);
      lookupService.findById.mockResolvedValue({
        ...user,
        role: UserRole.ADMIN,
      } as any);

      jest
        .spyOn<any, any>(service as any, 'createAuthResponse')
        .mockResolvedValue({
          accessToken: 'new_access',
          refreshToken: 'new_refresh',
          expiresIn: 900,
          tokenType: 'Bearer',
          user: { ...user, role: UserRole.ADMIN },
        } as AuthResponseDto);

      const result = await service.refresh(refreshDto);

      expect(logger.log).toHaveBeenCalledWith(
        'Refreshing access token',
        'Auth',
      );
      expect(mockedHelpers.verifyJwtToken).toHaveBeenCalledWith(
        jwtService,
        refreshDto.refreshToken,
      );
      expect(tokenService.verify).toHaveBeenCalledWith(
        user.id,
        refreshDto.refreshToken,
      );
      expect(tokenService.revoke).toHaveBeenCalledWith(refreshDto.refreshToken);
      expect(lookupService.findById).toHaveBeenCalledWith(user.id, {
        level: 'self',
      });
      expect(logger.log).toHaveBeenCalledWith(
        `Token refreshed for user: ${user.id}`,
        'Auth',
      );
      expect(result.accessToken).toBe('new_access');
      expect(result.user?.role).toBe(UserRole.ADMIN);
    });
  });

  describe('createAuthResponse', () => {
    it('generates tokens, stores refresh token and returns AuthResponseDto', async () => {
      mockedHelpers.generateTokens.mockReturnValue({
        accessToken: 'access',
        refreshToken: 'refresh',
        expiresIn: 900,
      });

      const result = await (service as any).createAuthResponse(
        user.id,
        user.email,
        user,
      );

      expect(mockedHelpers.generateTokens).toHaveBeenCalledWith(
        jwtService,
        user.id,
        user.email,
        user.username,
        user.role,
      );
      expect(tokenService.create).toHaveBeenCalledTimes(1);

      const [userIdArg, refreshTokenArg, expiresAtArg] =
        tokenService.create.mock.calls[0];

      expect(userIdArg).toBe(user.id);
      expect(refreshTokenArg).toBe('refresh');
      expect(expiresAtArg).toBeInstanceOf(Date);

      expect(result).toEqual({
        accessToken: 'access',
        refreshToken: 'refresh',
        user,
        expiresIn: 900,
        tokenType: 'Bearer',
      });
    });
  });
});
