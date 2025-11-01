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
} from '@nestjs/common';
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

  // Create a new user
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersService.create(dto);
  }

  // Update a user by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(id, dto);
  }

  // Delete a user by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeletedResourceDto> {
    return await this.usersService.remove(id);
  }

  // Get all users with pagination
  @Get()
  @Visibility('public')
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true }))
    skip = DEFAULT_PAGINATION_SKIP,
    @Query('take', new ParseIntPipe({ optional: true }))
    take = DEFAULT_PAGINATION_TAKE,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>[]> {
    return await this.usersService.findAll({
      ...context,
      skip,
      take,
    });
  }

  // Get a user by ID
  @Get('id/:id')
  @Visibility('public')
  async findById(
    @Param('id') id: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return await this.usersService.findById(id, context);
  }

  // Get a user by email
  @Get('email/:email')
  @Visibility('admin')
  async findByEmail(
    @Param('email') email: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return await this.usersService.findByEmail(email, context);
  }

  // Get a user by phone
  @Get('phone/:phone')
  @Visibility('admin')
  async findByPhone(
    @Param('phone') phone: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return await this.usersService.findByPhone(phone, context);
  }
}
