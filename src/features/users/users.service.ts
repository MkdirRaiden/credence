// src/features/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';
import { UsersRepository } from '@/features/users/users.repository';
import { CreateUserDto } from '@/features/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/features/users/dtos/update-user.dto';
import { UserResponseDto } from '@/features/users/dtos/user-response.dto';
import { FieldSelectorContext } from '@/common/interfaces';
import * as UsersMapper from '@/features/users/users.mapper';

@Injectable()
export class UsersService {
  private readonly logContext = 'UsersService';

  // Injecting UsersRepository and LoggerService
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: LoggerService,
  ) {}

  // Create a new user
  async create(dto: CreateUserDto): Promise<Partial<UserResponseDto>> {
    this.logger.log(`Creating user: ${dto.email}`, this.logContext);
    const createInput = UsersMapper.toCreateInput(dto);
    const user = await this.repository.create(createInput);
    this.logger.log(`User created with ID: ${user.id}`, this.logContext);
    return UsersMapper.toResponseDto(user);
  }

  // Get all users with pagination
  async findAll(
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>[]> {
    const users = await this.repository.findAll(context);
    return UsersMapper.toResponseDtoList(users);
  }

  // Get a user by ID
  async findById(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findById(id, context);
    return UsersMapper.toResponseDto(user!);
  }

  // Update a user by ID
  async update(
    id: string,
    dto: UpdateUserDto,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    this.logger.log(`Updating user: ${id}`, this.logContext);
    const updateInput = UsersMapper.toUpdateInput(dto);
    const user = await this.repository.update(id, updateInput, context);
    this.logger.log(`User updated: ${id}`, this.logContext);
    return UsersMapper.toResponseDto(user!);
  }

  // Soft delete a user by ID
  async remove(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    this.logger.log(`Soft deleting user: ${id}`, this.logContext);
    const user = await this.repository.softDelete(id, context);
    this.logger.log(`User soft deleted: ${id}`, this.logContext);
    return UsersMapper.toResponseDto(user!);
  }

  // Get a user by email
  async findByEmail(
    email: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByEmail(email, context);
    return UsersMapper.toResponseDto(user!);
  }

  // Get a user by phone
  async findByPhone(
    phone: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByPhone(phone, context);
    return UsersMapper.toResponseDto(user!);
  }

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    return this.repository.existsByEmail(email);
  }

  // Check if phone exists
  async phoneExists(phone: string): Promise<boolean> {
    return this.repository.existsByPhone(phone);
  }
}
