// src/features/users/controllers/users-crud.controller.ts
import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from '@/features/auth/guards';
import { Roles } from '@/common/decorators';
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
   * Update user (authenticated users)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: userDtos.UpdateUserDto,
  ): Promise<userDtos.UserResponseDto> {
    return this.crudService.update(id, dto);
  }

  /**
   * Delete user (authenticated users)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUuidPipe) id: string,
  ): Promise<userDtos.DeletedResourceDto> {
    return this.crudService.remove(id);
  }
}
