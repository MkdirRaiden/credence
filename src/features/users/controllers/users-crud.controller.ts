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
import {
  CreateUserDto,
  UserResponseDto,
  UpdateUserDto,
  DeletedResourceDto,
} from '@/features/users/dtos';
import { UserRole } from '@prisma/client';
import * as guards from '@/features/shared/security/guards';
import { Roles, CurrentUser } from '@/common/decorators';
import { ParseUuidPipe } from '@/common/pipes';
import { UsersCrudService } from '@/features/users/services';

/**
 * User management endpoints with role-based access control
 */
@Controller('users')
export class UsersCrudController {
  constructor(private readonly crudService: UsersCrudService) {}

  @Post()
  @UseGuards(guards.JwtAuthGuard, guards.RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.crudService.create(dto);
  }

  @Put(':id')
  @UseGuards(guards.JwtAuthGuard)
  async update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<UserResponseDto> {
    this.checkOwnershipOrAdmin(id, currentUser);
    return this.crudService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(guards.JwtAuthGuard)
  async remove(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<DeletedResourceDto> {
    this.checkOwnershipOrAdmin(id, currentUser);
    return this.crudService.remove(id);
  }

  private checkOwnershipOrAdmin(
    resourceUserId: string,
    currentUser: UserResponseDto,
  ): void {
    if (
      currentUser.id !== resourceUserId &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('You can only access your own resources');
    }
  }
}
