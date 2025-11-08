// src/features/auth/auth.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseCrudService } from '@/features/users/contracts';
import { RefreshTokenService } from '@/features/refresh-tokens/services';
import { LoggerService } from '@/logger/services';
import * as authDtos from '@/features/auth/dtos';
import * as helpers from '@/features/auth/helpers';
import { LOG_CONTEXTS } from '@/logger/constants';

/**
 * Orchestrates authentication flows (register, login, refresh, logout)
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(BaseCrudService) private readonly crudService: BaseCrudService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Register new user, hash password, generate tokens, store refresh token in DB
   */
  async register(
    registerDto: authDtos.RegisterDto,
  ): Promise<authDtos.AuthResponseDto> {
    this.logger.log(
      `Registering user: ${registerDto.email}`,
      LOG_CONTEXTS.AUTH,
    );
    const { password, ...userFields } = registerDto;
    const user = await this.crudService.create({
      ...userFields,
      passwordHash: await helpers.hashPassword(password),
    });
    this.logger.log(`User registered: ${user.id}`, LOG_CONTEXTS.AUTH);
    return this.createAuthResponse(user.id, user.email, user);
  }

  /**
   * Generate tokens for authenticated user
   * Called after LocalStrategy validates credentials
   */
  async login(
    user: Partial<authDtos.UserResponseDto>,
  ): Promise<authDtos.AuthResponseDto> {
    this.logger.log(`User logged in: ${user.id}`, LOG_CONTEXTS.AUTH);
    return this.createAuthResponse(
      user.id!,
      user.email!,
      user as authDtos.UserResponseDto,
    );
  }

  /**
   * Verify refresh token in DB, revoke old token, generate new tokens
   */
  async refresh(
    refreshTokenDto: authDtos.RefreshTokenDto,
  ): Promise<authDtos.AuthResponseDto> {
    this.logger.log('Refreshing access token', LOG_CONTEXTS.AUTH);

    const payload = helpers.verifyJwtToken(
      this.jwtService,
      refreshTokenDto.refreshToken,
    );

    await this.refreshTokenService.verify(
      payload.sub,
      refreshTokenDto.refreshToken,
    );

    await this.refreshTokenService.revoke(refreshTokenDto.refreshToken);

    this.logger.log(
      `Token refreshed for user: ${payload.sub}`,
      LOG_CONTEXTS.AUTH,
    );
    return this.createAuthResponse(
      payload.sub,
      payload.email,
      undefined,
      payload.username,
    );
  }

  /**
   * Revoke refresh token (logout)
   */
  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revoke(refreshToken);
    this.logger.log('User logged out', LOG_CONTEXTS.AUTH);
  }

  /**
   * Generate tokens and store refresh token in DB
   */
  private async createAuthResponse(
    userId: string,
    email: string,
    user?: authDtos.UserResponseDto,
    username?: string,
  ): Promise<authDtos.AuthResponseDto> {
    const { accessToken, refreshToken, expiresIn } = helpers.generateTokens(
      this.jwtService,
      userId,
      email,
      username || user?.username,
    );

    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await this.refreshTokenService.create(userId, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user,
      expiresIn,
    };
  }
}
