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
import { LocalAuthGuard } from '@/features/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  RefreshTokenDto,
} from '@/features/auth/dtos';
import { UserResponseDto } from '@/features/users/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /auth/register
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Login user with email and password
   * POST /auth/login
   * Requires: email and password in request body
   * Uses: LoginDto for input validation, LocalAuthGuard for credential validation
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() _loginDto: LoginDto,
    @Request() req: Express.Request,
  ): Promise<AuthResponseDto> {
    // _loginDto validates input structure (email format, password length, etc.)
    // LocalStrategy validates credentials (email exists, password matches)
    // req.user contains the validated user from LocalStrategy
    return this.authService.login(req.user as UserResponseDto);
  }

  /**
   * Refresh access token using refresh token
   * POST /auth/refresh
   */
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }

  /**
   * Get current authenticated user
   * GET /auth/me
   * Requires: JWT token in Authorization header
   * Uses: JwtAuthGuard validates token via JwtStrategy
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: UserResponseDto): Promise<UserResponseDto> {
    return user;
  }
}
