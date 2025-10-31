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
import { UsersService } from '@/features/users/users.service';
import { CreateUserDto } from '@/features/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/features/users/dtos/update-user.dto';
import { UserResponseDto } from '@/features/users/dtos/user-response.dto';
import { Visibility, GetVisibilityContext } from '@/common/decorators';
import { FieldSelectorContext } from '@/common/interfaces';
import {
  DEFAULT_PAGINATION_SKIP,
  DEFAULT_PAGINATION_TAKE,
} from '@/common/constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<Partial<UserResponseDto>> {
    return this.usersService.create(dto);
  }

  // __Public endpoints__
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
    return this.usersService.findAll({
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
    return this.usersService.findById(id, context);
  }
  // Update a user by ID
  @Put(':id')
  @Visibility('self')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.update(id, dto, context);
  }
  // Delete a user by ID
  @Delete(':id')
  @Visibility('self')
  async remove(
    @Param('id') id: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.remove(id, context);
  }

  // __Admin specific endpoints__
  // Get a user by email
  @Get('email/:email')
  @Visibility('admin')
  async findByEmail(
    @Param('email') email: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findByEmail(email, context);
  }
  // Get a user by phone
  @Get('phone/:phone')
  @Visibility('admin')
  async findByPhone(
    @Param('phone') phone: string,
    @GetVisibilityContext() context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    return this.usersService.findByPhone(phone, context);
  }
}
