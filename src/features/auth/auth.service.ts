// src/features/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseUserService } from '@/features/users/base-user.service';
import { LoggerService } from '@/logger/logger.service';
import {
  RegisterDto,
  AuthResponseDto,
  RefreshTokenDto,
} from '@/features/auth/dtos';
import { UserResponseDto } from '@/features/users/dtos';
import {
  hashPassword,
  verifyPassword,
  generateTokens,
} from '@/features/auth/helpers';

@Injectable()
export class AuthService {
  private readonly logContext = 'AuthService';
  constructor(
    private readonly userService: BaseUserService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Validates user credentials (email + password).
   * Used by LocalStrategy for Passport authentication.
   * @returns User object (without passwordHash) if valid, null otherwise
   */
  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Find user by email
      const user = await this.userService.findByEmailForAuth(email);
      // Check if user has a password set
      if (!user.passwordHash) return null;
      // Verify password
      const isPasswordValid = await verifyPassword(password, user.passwordHash);
      if (!isPasswordValid) return null;
      // Remove sensitive data before returning
      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      // If user not found or any error, return null
      return null;
    }
  }

  /**
   * Register a new user with password, create account, generate tokens
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
   * Authenticate user with validated credentials, generate tokens
   * Called after LocalStrategy validates email/password
   * @param user - Pre-validated user object from LocalStrategy
   */
  async login(user: UserResponseDto): Promise<AuthResponseDto> {
    this.logger.log(`User logged in: ${user.id}`, this.logContext);
    return this.createAuthResponse(user.id, user.email, user);
  }
  /**
   * Refresh access token using refresh token
   */
  async refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    this.logger.log('Refreshing access token', this.logContext);
    let payload: { sub: string; email: string };
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
    return this.createAuthResponse(payload.sub, payload.email);
  }

  /**
   * Create authentication response with tokens
   * @param userId - User's unique ID
   * @param email - User's email
   * @param user - Optional user data (omitted on refresh)
   */
  private createAuthResponse(
    userId: string,
    email: string,
    user?: UserResponseDto,
  ): AuthResponseDto {
    const { accessToken, refreshToken, expiresIn } = generateTokens(
      this.jwtService,
      userId,
      email,
    );

    return {
      accessToken,
      refreshToken,
      user,
      expiresIn,
    };
  }
}
