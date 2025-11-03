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
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import {
  DEFAULT_PAGINATION_SKIP,
  DEFAULT_PAGINATION_TAKE,
} from '@/common/constants';
import { UsersService } from '@/features/users/users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@/features/users/dtos';
import { DeletedResourceDto } from '@/common/dtos';
import { Visibility, GetVisibilityContext } from '@/common/decorators';
import { FieldSelectorContext } from '@/common/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user (protected)
   * POST /users
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  /**
   * Update a user by ID (protected)
   * PUT /users/:id
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }

  /**
   * Delete a user by ID (protected)
   * DELETE /users/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<DeletedResourceDto> {
    return this.usersService.remove(id);
  }

  /**
   * Get all users with pagination and public visibility
   * GET /users?skip=0&take=10
   */
  @Get()
  @Visibility('public')
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true }))
    skip = DEFAULT_PAGINATION_SKIP,
    @Query('take', new ParseIntPipe({ optional: true }))
    take = DEFAULT_PAGINATION_TAKE,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>[]> {
    return this.usersService.findAll({
      ...context,
      skip,
      take,
    });
  }

  /**
   * Get a user by ID with public visibility
   * GET /users/id/:id
   */
  @Get('id/:id')
  @Visibility('public')
  async findById(
    @Param('id') id: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findById(id, context);
  }

  /**
   * Get a user by email (admin only - protected)
   * GET /users/email/:email
   */
  @Get('email/:email')
  @UseGuards(JwtAuthGuard)
  @Visibility('admin')
  async findByEmail(
    @Param('email') email: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findByEmail(email, context);
  }

  /**
   * Get a user by phone (admin only - protected)
   * GET /users/phone/:phone
   */
  @Get('phone/:phone')
  @UseGuards(JwtAuthGuard)
  @Visibility('admin')
  async findByPhone(
    @Param('phone') phone: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findByPhone(phone, context);
  }
}
