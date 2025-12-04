// src/features/users/controllers/users-lookup.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as swagger from '@nestjs/swagger';
import * as guards from '@/features/shared/security/guards';
import { Roles } from '@/common/decorators';
import { ParseUuidPipe } from '@/common/pipes';
import { UsersLookupService } from '@/features/users/services';
import { UserResponseDto, PaginationQueryDto } from '@/features/users/dtos';
import { Visibility, GetVisibilityContext } from '@/common/decorators';
import { FieldSelectorContext } from '@/common/interfaces';

@swagger.ApiTags('users')
@Controller('users')
export class UsersLookupController {
  constructor(private readonly lookupService: UsersLookupService) {}

  @Get('id/:id')
  @HttpCode(200)
  @UseGuards(guards.OptionalJwtAuthGuard)
  @Visibility('public')
  @swagger.ApiOkResponse({
    type: UserResponseDto,
    description: 'User found',
  })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  async findById(
    @Param('id', ParseUuidPipe) id: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.lookupService.findById(id, context);
  }

  @Get('username/:username')
  @HttpCode(200)
  @Visibility('public')
  @swagger.ApiOkResponse({
    type: UserResponseDto,
    description: 'User found',
  })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  async findByUsername(
    @Param('username') username: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.lookupService.findByUsername(username, context);
  }

  @Get('email/:email')
  @HttpCode(200)
  @UseGuards(guards.JwtAuthGuard, guards.RolesGuard)
  @Roles(UserRole.ADMIN)
  @Visibility('admin')
  @swagger.ApiBearerAuth()
  @swagger.ApiOkResponse({
    type: UserResponseDto,
    description: 'User found',
  })
  @swagger.ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @swagger.ApiForbiddenResponse({ description: 'Forbidden' })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  async findByEmail(
    @Param('email') email: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.lookupService.findByEmail(email, context);
  }

  @Get('phone/:phone')
  @HttpCode(200)
  @UseGuards(guards.JwtAuthGuard, guards.RolesGuard)
  @Roles(UserRole.ADMIN)
  @Visibility('admin')
  @swagger.ApiBearerAuth()
  @swagger.ApiOkResponse({
    type: UserResponseDto,
    description: 'User found',
  })
  @swagger.ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @swagger.ApiForbiddenResponse({ description: 'Forbidden' })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  async findByPhone(
    @Param('phone') phone: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.lookupService.findByPhone(phone, context);
  }

  @Get()
  @HttpCode(200)
  @Visibility('public')
  @swagger.ApiOkResponse({
    type: UserResponseDto,
    isArray: true,
    description: 'List of users',
  })
  @swagger.ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of records to skip',
  })
  @swagger.ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of records to take',
  })
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
