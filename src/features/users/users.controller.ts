// src/features/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '@/features/auth/guards';
import { Roles } from '@/common/decorators';
import { ParseUuidPipe } from '@/common/pipes';
import { UsersService } from '@/features/users/users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  PaginationQueryDto,
  DeletedResourceDto,
} from '@/features/users/dtos';
import { Visibility, GetVisibilityContext } from '@/common/decorators';
import { FieldSelectorContext } from '@/common/interfaces';

/**
 * User management endpoints with role-based access control
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get user by ID (public visibility)
   */
  @Get('id/:id')
  @Visibility('public')
  async findById(
    @Param('id', ParseUuidPipe) id: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findById(id, context);
  }

  /**
   * Get user by username (public visibility)
   */
  @Get('username/:username')
  @Visibility('public')
  async findByUsername(
    @Param('username') username: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findByUsername(username, context);
  }

  /**
   * Get user by email (admin only)
   */
  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Visibility('admin')
  async findByEmail(
    @Param('email') email: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findByEmail(email, context);
  }

  /**
   * Get user by phone (admin only)
   */
  @Get('phone/:phone')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Visibility('admin')
  async findByPhone(
    @Param('phone') phone: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findByPhone(phone, context);
  }

  /**
   * Create new user (admin only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  /**
   * Update user (authenticated users)
   * Service layer handles owner/admin authorization
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }

  /**
   * Delete user (authenticated users)
   * Service layer handles owner/admin authorization
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUuidPipe) id: string,
  ): Promise<DeletedResourceDto> {
    return this.usersService.remove(id);
  }

  /**
   * Get all users with pagination (public visibility)
   */
  @Get()
  @Visibility('public')
  async findAll(
    @Query() query: PaginationQueryDto,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>[]> {
    return this.usersService.findAll({
      ...context,
      skip: query.skip,
      take: query.take,
    });
  }
}
