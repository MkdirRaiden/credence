// src/features/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';
import { UsersRepository } from '@/features/users/users.repository';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@/features/users/dtos';
import { DeletedResourceDto } from '@/common/dtos';
import { FieldSelectorContext } from '@/common/interfaces';
import { BaseUserService } from '@/features/users/base-user.service';
import { User } from '@prisma/client';
import * as UsersMapper from '@/features/users/users.mapper';

@Injectable()
export class UsersService extends BaseUserService {
  private readonly logContext = 'UsersService';

  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  /**
   * Create a new user.
   */
  async create(
    dto: CreateUserDto & { passwordHash?: string },
  ): Promise<UserResponseDto> {
    this.logger.log(`Creating user: ${dto.email}`, this.logContext);
    const createInput = UsersMapper.toCreateInput(dto);
    const user = await this.repository.create(createInput);
    this.logger.log(`User created with ID: ${user.id}`, this.logContext);
    return UsersMapper.toResponseDto(user) as UserResponseDto;
  }

  /**
   * Update a user by ID.
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user: ${id}`, this.logContext);
    const updateInput = UsersMapper.toUpdateInput(dto);
    const user = await this.repository.update(id, updateInput);
    this.logger.log(`User updated: ${id}`, this.logContext);
    return UsersMapper.toResponseDto(user) as UserResponseDto;
  }

  /**
   * Soft delete a user by ID.
   */
  async remove(id: string): Promise<DeletedResourceDto> {
    this.logger.log(`Soft deleting user: ${id}`, this.logContext);
    const deleted = await this.repository.softDelete(id);
    this.logger.log(`User soft deleted: ${id}`, this.logContext);
    return deleted;
  }

  /**
   * Get all users with pagination and visibility.
   */
  async findAll(
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>[]> {
    const users = await this.repository.findAll(context);
    return UsersMapper.toResponseDtoList(users);
  }

  /**
   * Get a user by ID with visibility.
   */
  async findById(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findById(id, context);
    return UsersMapper.toResponseDto(user);
  }

  /**
   * Get a user by email with visibility.
   */
  async findByEmail(
    email: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByEmail(email, context);
    return UsersMapper.toResponseDto(user);
  }

  /**
   * Get a user by username with visibility (public endpoint).
   */
  async findByUsername(
    username: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByUsername(username, context);
    return UsersMapper.toResponseDto(user);
  }

  /**
   * Get a user by phone with visibility.
   */
  async findByPhone(
    phone: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByPhone(phone, context);
    return UsersMapper.toResponseDto(user);
  }

  /**
   * Get full user by email for auth verification (bypasses visibility).
   */
  async findByEmailForAuth(email: string): Promise<User> {
    this.logger.log(`Finding user for auth: ${email}`, this.logContext);
    return await this.repository.findByEmailForAuth(email);
  }

  /**
   * Get full user by username for auth verification (bypasses visibility).
   */
  async findByUsernameForAuth(username: string): Promise<User> {
    this.logger.log(
      `Finding user for auth by username: ${username}`,
      this.logContext,
    );
    return await this.repository.findByUsernameForAuth(username);
  }
}
