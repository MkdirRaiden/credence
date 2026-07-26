// src/features/auth/auth.service.ts
import * as authDtos from '@/features/auth/dtos';
import { InvalidRefreshTokenException } from '@/common/exceptions';
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { BaseCrudService, BaseLookupService } from '@/features/users/contracts';
import { BaseTokenService } from '@/features/shared/tokens/contracts';
import { LoggerService } from '@/logger/services';
import * as helpers from '@/features/auth/helpers';
import { LOG_CONTEXTS, TOKEN_TYPE } from '@/common/constants';
import { filterUndefined } from '@/common/utils';

interface RefreshTokenPayload {
  sub: string;
  email: string;
  username?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(BaseCrudService)
    private readonly crudService: BaseCrudService,
    @Inject(BaseLookupService)
    private readonly lookupService: BaseLookupService,
    @Inject(BaseTokenService)
    private readonly refreshTokenService: BaseTokenService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

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
    return this.createAuthResponse(user as authDtos.UserResponseDto);
  }

  async login(
    user: authDtos.UserResponseDto,
  ): Promise<authDtos.AuthResponseDto> {
    this.logger.log(`User logged in: ${user.id}`, LOG_CONTEXTS.AUTH);
    // at this point user comes from JwtStrategy or CredentialsService and has id/email
    return this.createAuthResponse(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revoke(refreshToken);
    this.logger.log('User logged out', LOG_CONTEXTS.AUTH);
  }

  async refresh(
    refreshTokenDto: authDtos.RefreshTokenDto,
  ): Promise<authDtos.AuthResponseDto> {
    this.logger.log('Refreshing access token', LOG_CONTEXTS.AUTH);

    const payload = this.verifyRefreshTokenJwt(refreshTokenDto.refreshToken);

    const isValidToken = await this.refreshTokenService.isValidToken(
      payload.sub,
      refreshTokenDto.refreshToken,
    );
    if (!isValidToken) throw new InvalidRefreshTokenException();

    await this.refreshTokenService.revoke(refreshTokenDto.refreshToken);

    const user = await this.lookupService.findById(payload.sub, {
      level: 'self',
    });

    this.logger.log(
      `Token refreshed for user: ${payload.sub}`,
      LOG_CONTEXTS.AUTH,
    );

    return this.createAuthResponse(user as authDtos.UserResponseDto);
  }

  private verifyRefreshTokenJwt(token: string): RefreshTokenPayload {
    try {
      return this.jwtService.verify<RefreshTokenPayload>(token);
    } catch {
      throw new InvalidRefreshTokenException();
    }
  }

  private async createAuthResponse(
    user: authDtos.UserResponseDto,
  ): Promise<authDtos.AuthResponseDto> {
    const { id, email, username, role = UserRole.USER } = user;

    const { accessToken, refreshToken, expiresIn } = helpers.generateTokens(
      this.jwtService,
      id,
      email,
      username,
      role,
    );

    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await this.refreshTokenService.create(id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: filterUndefined(user),
      expiresIn,
      tokenType: TOKEN_TYPE,
    };
  }
}
