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
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  RegisterDto,
  UserResponseDto,
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
} from '@/features/auth/dtos';
import {
  LocalAuthGuard,
  JwtAuthGuard,
} from '@/features/shared/security/guards';
import { AuthService } from '@/features/auth/services';
import { CurrentUser } from '@/common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: AuthResponseDto, description: 'User registered' })
  @ApiConflictResponse({
    description: 'Email or username already in use',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto, description: 'User logged in' })
  @ApiUnauthorizedResponse({
    description: 'Invalid email, username, or password',
  })
  async login(
    @Body() _loginDto: LoginDto,
    @Request() req: { user: UserResponseDto },
  ): Promise<AuthResponseDto> {
    // LocalAuthGuard attaches a validated UserResponseDto to req.user
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'Access token refreshed',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ description: 'User logged out' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getMe(
    @CurrentUser() user: Partial<UserResponseDto>,
  ): Partial<UserResponseDto> {
    return user;
  }
}
