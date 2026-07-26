// src/features/users/controllers/users-crud.controller.ts
import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
  HttpCode,
} from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as userDtos from '@/features/users/dtos';
import { UserRole } from '@prisma/client';
import * as guards from '@/features/shared/security/guards';
import { Roles } from '@/common/decorators';
import { ParseUuidPipe } from '@/common/pipes';
import { UsersCrudService } from '@/features/users/services';

@swagger.ApiTags('users')
@swagger.ApiBearerAuth()
@Controller('users')
export class UsersCrudController {
  constructor(private readonly crudService: UsersCrudService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(guards.JwtAuthGuard, guards.RolesGuard)
  @Roles(UserRole.ADMIN)
  @swagger.ApiCreatedResponse({
    type: userDtos.UserResponseDto,
    description: 'User created',
  })
  @swagger.ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @swagger.ApiForbiddenResponse({ description: 'Forbidden' })
  @swagger.ApiConflictResponse({
    description: 'Email, username, or phone already in use',
  })
  async create(
    @Body() dto: userDtos.CreateUserDto,
  ): Promise<Partial<userDtos.UserResponseDto>> {
    return this.crudService.create(dto);
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(guards.JwtAuthGuard, guards.OwnershipGuard)
  @swagger.ApiOkResponse({
    type: userDtos.UserResponseDto,
    description: 'User updated',
  })
  async update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: userDtos.UpdateUserDto,
  ): Promise<Partial<userDtos.UserResponseDto>> {
    return this.crudService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(guards.JwtAuthGuard, guards.OwnershipGuard)
  @swagger.ApiOkResponse({
    type: userDtos.DeletedResourceDto,
    description: 'User soft deleted',
  })
  async remove(
    @Param('id', ParseUuidPipe) id: string,
  ): Promise<userDtos.DeletedResourceDto> {
    return this.crudService.remove(id);
  }
}
