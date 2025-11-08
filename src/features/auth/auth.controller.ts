// src/features/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '@/features/auth/services';
import { CurrentUser } from '@/common/decorators';
import { LocalAuthGuard, JwtAuthGuard } from '@/features/auth/guards';
import * as authDtos from '@/features/auth/dtos';

/**
 * Authentication endpoints for register, login, refresh, logout, and profile
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user account with password
   */
  @Post('register')
  async register(
    @Body() registerDto: authDtos.RegisterDto,
  ): Promise<authDtos.AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Login with email/username and password
   * LocalAuthGuard validates credentials via LocalStrategy
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() _loginDto: authDtos.LoginDto,
    @Request() req: { user: authDtos.UserResponseDto },
  ): Promise<authDtos.AuthResponseDto> {
    return this.authService.login(req.user);
  }

  /**
   * Refresh expired access token using refresh token
   */
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: authDtos.RefreshTokenDto,
  ): Promise<authDtos.AuthResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }

  /**
   * Logout by revoking refresh token
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Body() refreshTokenDto: authDtos.RefreshTokenDto,
  ): Promise<void> {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  /**
   * Get current authenticated user profile
   * JwtAuthGuard validates JWT token via JwtStrategy
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(
    @CurrentUser() user: authDtos.UserResponseDto,
  ): authDtos.UserResponseDto {
    return user;
  }
}
