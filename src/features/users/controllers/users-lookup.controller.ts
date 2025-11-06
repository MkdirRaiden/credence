// src/features/users/controllers/users-lookup.controller.ts
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '@/features/auth/guards';
import { Roles } from '@/common/decorators';
import { ParseUuidPipe } from '@/common/pipes';
import { UserLookupService } from '@/features/users/services';
import { UserResponseDto, PaginationQueryDto } from '@/features/users/dtos';
import { Visibility, GetVisibilityContext } from '@/common/decorators';
import { FieldSelectorContext } from '@/common/interfaces';

/**
 * User management endpoints with role-based access control
 */
@Controller('users')
export class UsersLookupController {
  constructor(private readonly lookupService: UserLookupService) {}

  /**
   * Get user by ID (public visibility)
   */
  @Get('id/:id')
  @Visibility('public')
  async findById(
    @Param('id', ParseUuidPipe) id: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.lookupService.findById(id, context);
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
    return this.lookupService.findByUsername(username, context);
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
    return this.lookupService.findByEmail(email, context);
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
    return this.lookupService.findByPhone(phone, context);
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
    return this.lookupService.findAll({
      ...context,
      skip: query.skip,
      take: query.take,
    });
  }
}
