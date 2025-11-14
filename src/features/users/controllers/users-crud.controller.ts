// src/features/users/controllers/users-crud.controller.ts
import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '@/features/auth/guards';
import { Roles, CurrentUser } from '@/common/decorators';
import { ParseUuidPipe } from '@/common/pipes';
import { UserCrudService } from '@/features/users/services';
import * as userDtos from '@/features/users/dtos';

/**
 * User management endpoints with role-based access control
 */
@Controller('users')
export class UsersCrudController {
  constructor(private readonly crudService: UserCrudService) {}

  /**
   * Create new user (admin only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() dto: userDtos.CreateUserDto,
  ): Promise<userDtos.UserResponseDto> {
    return this.crudService.create(dto);
  }

  /**
   * Update user (self or admin only)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: userDtos.UpdateUserDto,
    @CurrentUser() currentUser: userDtos.UserResponseDto,
  ): Promise<userDtos.UserResponseDto> {
    this.checkOwnershipOrAdmin(id, currentUser);
    return this.crudService.update(id, dto);
  }

  /**
   * Delete user (self or admin only)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() currentUser: userDtos.UserResponseDto,
  ): Promise<userDtos.DeletedResourceDto> {
    this.checkOwnershipOrAdmin(id, currentUser);
    return this.crudService.remove(id);
  }

  /**
   * Verifies user can only modify their own resources unless they're an admin
   * @throws ForbiddenException if user is not the owner and not an admin
   */
  private checkOwnershipOrAdmin(
    resourceUserId: string,
    currentUser: userDtos.UserResponseDto,
  ): void {
    if (
      currentUser.id !== resourceUserId &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('You can only access your own resources');
    }
  }
}
