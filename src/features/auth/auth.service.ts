// src/features/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseUserService } from '@/features/users/base-user.service';
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
  validateUserCredentials,
} from '@/features/auth/helpers';

/**
 * Authentication service handling registration, login, token refresh, and credential validation
 */
@Injectable()
export class AuthService {
  private readonly logContext = 'AuthService';

  constructor(
    private readonly userService: BaseUserService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Validate user credentials (email OR username) + password
   * Used by LocalStrategy before login
   */
  async validateUser(
    emailOrUsername: string,
    password: string,
  ): Promise<Partial<UserResponseDto> | null> {
    return validateUserCredentials(emailOrUsername, password, this.userService);
  }

  /**
   * Register new user, hash password, generate tokens
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`Registering user: ${registerDto.email}`, this.logContext);
    const { password, ...userFields } = registerDto;
    const user = await this.userService.create({
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
  login(user: Partial<UserResponseDto>): AuthResponseDto {
    this.logger.log(`User logged in: ${user.id}`, this.logContext);
    return this.createAuthResponse(
      user.id!,
      user.email!,
      user as UserResponseDto,
    );
  }

  /**
   * Verify refresh token and generate new access + refresh tokens
   * @throws UnauthorizedException if token invalid/expired
   */
  refresh(refreshTokenDto: RefreshTokenDto): AuthResponseDto {
    this.logger.log('Refreshing access token', this.logContext);
    let payload: { sub: string; email: string; username?: string };

    try {
      payload = this.jwtService.verify(refreshTokenDto.refreshToken);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Token refresh failed: ${message}`, this.logContext);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

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
   * Build auth response with generated tokens
   * User field is optional (included for register/login, omitted for refresh)
   */
  private createAuthResponse(
    userId: string,
    email: string,
    user?: UserResponseDto,
    username?: string,
  ): AuthResponseDto {
    const { accessToken, refreshToken, expiresIn } = generateTokens(
      this.jwtService,
      userId,
      email,
      username || user?.username,
    );

    return {
      accessToken,
      refreshToken,
      user,
      expiresIn,
    };
  }
}
