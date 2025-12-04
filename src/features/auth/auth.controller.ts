// src/features/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as authDtos from '@/features/auth/dtos';
import * as guards from '@/features/shared/security/guards';
import { AuthService } from '@/features/auth/services';
import { CurrentUser } from '@/common/decorators';

@swagger.ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @swagger.ApiCreatedResponse({ type: authDtos.AuthResponseDto, description: 'User registered' })
  @swagger.ApiConflictResponse({
    description: 'Email or username already in use',
  })
  async register(@Body() registerDto: authDtos.RegisterDto): Promise<authDtos.AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(guards.LocalAuthGuard)
  @HttpCode(200)
  @swagger.ApiBody({ type: authDtos.LoginDto })
  @swagger.ApiOkResponse({ type: authDtos.AuthResponseDto, description: 'User logged in' })
  @swagger.ApiUnauthorizedResponse({
    description: 'Invalid email, username, or password',
  })
  async login(
    @Body() _loginDto: authDtos.LoginDto,
    @Request() req: { user: authDtos.UserResponseDto },
  ): Promise<authDtos.AuthResponseDto> {
    // LocalAuthGuard attaches a validated UserResponseDto to req.user
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(200)
  @swagger.ApiBody({ type: authDtos.RefreshTokenDto })
  @swagger.ApiOkResponse({
    type: authDtos.AuthResponseDto,
    description: 'Access token refreshed',
  })
  @swagger.ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
  })
  async refresh(
    @Body() refreshTokenDto: authDtos.RefreshTokenDto,
  ): Promise<authDtos.AuthResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(guards.JwtAuthGuard)
  @HttpCode(204)
  @swagger.ApiBearerAuth()
  @swagger.ApiBody({ type: authDtos.RefreshTokenDto })
  @swagger.ApiOkResponse({ description: 'User logged out' })
  async logout(@Body() refreshTokenDto: authDtos.RefreshTokenDto): Promise<void> {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Get('me')
  @UseGuards(guards.JwtAuthGuard)
  @HttpCode(200)
  @swagger.ApiBearerAuth()
  @swagger.ApiOkResponse({ type: authDtos.UserResponseDto })
  @swagger.ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getMe(
    @CurrentUser() user: Partial<authDtos.UserResponseDto>,
  ): Partial<authDtos.UserResponseDto> {
    return user;
  }
}
