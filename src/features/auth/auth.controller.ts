// src/features/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  RegisterDto,
  UserResponseDto,
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
} from '@/features/auth/dtos';
import { AuthService } from '@/features/auth/services';
import { CurrentUser } from '@/common/decorators';
import * as guards from '@/features/shared/security/guards';

/**
 * Authentication endpoints for register, login, refresh, logout, and profile
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(guards.LocalAuthGuard)
  async login(
    @Body() _loginDto: LoginDto,
    @Request() req: { user: UserResponseDto },
  ): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(guards.JwtAuthGuard)
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Get('me')
  @UseGuards(guards.JwtAuthGuard)
  getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
    return user;
  }
}
