// src/features/users/controllers/users-crud.controller.ts
import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
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
import { UserAccessForbiddenException } from '@/common/exceptions';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersCrudController {
  constructor(private readonly crudService: UsersCrudService) {}

  @Post()
  @UseGuards(guards.JwtAuthGuard, guards.RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User created',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({
    description: 'Email, username, or phone already in use',
  })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.crudService.create(dto);
  }

  @Patch(':id')
  @UseGuards(guards.JwtAuthGuard)
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'User updated',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'You can only access your own resources',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
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
  @ApiOkResponse({
    type: DeletedResourceDto,
    description: 'User soft deleted',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'You can only access your own resources',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
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
    const isOwner = currentUser.id === resourceUserId;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new UserAccessForbiddenException();
    }
  }
}
