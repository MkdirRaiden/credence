// src/features/auth/auth.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseCrudService } from '@/features/users/contracts';
import { RefreshTokenService } from '@/features/refresh-tokens/refresh-token.service';
import { LoggerService } from '@/logger/logger.service';
import {
  RegisterDto,
  AuthResponseDto,
  RefreshTokenDto,
  UserResponseDto,
} from '@/features/auth/dtos';
import {
  hashPassword,
  generateTokens,
  verifyJwtToken,
} from '@/features/auth/helpers';

/**
 * Orchestrates authentication flows (register, login, refresh, logout)
 */
@Injectable()
export class AuthService {
  private readonly logContext = 'AuthService';

  constructor(
    @Inject(BaseCrudService) private readonly crudService: BaseCrudService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Register new user, hash password, generate tokens, store refresh token in DB
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`Registering user: ${registerDto.email}`, this.logContext);
    const { password, ...userFields } = registerDto;
    const user = await this.crudService.create({
      ...userFields,
      passwordHash: await hashPassword(password),
    });
    this.logger.log(`User registered: ${user.id}`, this.logContext);
    return this.createAuthResponse(user.id, user.email, user);
  }

  /**
   * Generate tokens for authenticated user
   * Called after LocalStrategy validates credentials
   */
  async login(user: Partial<UserResponseDto>): Promise<AuthResponseDto> {
    this.logger.log(`User logged in: ${user.id}`, this.logContext);
    return this.createAuthResponse(
      user.id!,
      user.email!,
      user as UserResponseDto,
    );
  }

  /**
   * Verify refresh token in DB, revoke old token, generate new tokens
   */
  async refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    this.logger.log('Refreshing access token', this.logContext);

    const payload = verifyJwtToken(
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
      this.logContext,
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
    this.logger.log('User logged out', this.logContext);
  }

  /**
   * Generate tokens and store refresh token in DB
   */
  private async createAuthResponse(
    userId: string,
    email: string,
    user?: UserResponseDto,
    username?: string,
  ): Promise<AuthResponseDto> {
    const { accessToken, refreshToken, expiresIn } = generateTokens(
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
