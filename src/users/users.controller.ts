import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { UsersMapper } from './users.mapper';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create user endpoint
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(dto);
    return UsersMapper.toResponse(user);
  }

  // Get user by ID
  @Get('id/:id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id); // throws if not found
    return UsersMapper.toResponse(user);
  }

  // Get user by email
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email); // throws if not found
    return UsersMapper.toResponse(user);
  }
}
