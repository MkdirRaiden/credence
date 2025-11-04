// src/features/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '@/features/auth/auth.service';
import { CurrentUser } from '@/common/decorators';
import { LocalAuthGuard, JwtAuthGuard } from '@/features/auth/guards';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  RefreshTokenDto,
  UserResponseDto,
} from '@/features/auth/dtos';

/**
 * Authentication endpoints for register, login, refresh, and profile
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user account with password
   * @param registerDto - User data + password
   * @returns AuthResponseDto with tokens and user info
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Login with email/username and password
   * LocalAuthGuard validates credentials via LocalStrategy before reaching handler
   * @param _loginDto - Validates input format (email/username + password)
   * @param req - Contains validated user from LocalStrategy
   * @returns AuthResponseDto with tokens and user info
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(
    @Body() _loginDto: LoginDto,
    @Request() req: { user: UserResponseDto },
  ): AuthResponseDto {
    return this.authService.login(req.user);
  }

  /**
   * Refresh expired access token using refresh token
   * @param refreshTokenDto - Valid refresh token
   * @returns AuthResponseDto with new tokens (no user data)
   */
  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenDto): AuthResponseDto {
    return this.authService.refresh(refreshTokenDto);
  }

  /**
   * Get current authenticated user profile
   * JwtAuthGuard validates JWT token via JwtStrategy before reaching handler
   * @param user - Decoded JWT payload from JwtStrategy
   * @returns UserResponseDto with current user info
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: UserResponseDto): UserResponseDto {
    return user;
  }
}
