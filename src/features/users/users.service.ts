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
  private readonly context = 'UsersService';

  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateUserDto): Promise<Partial<UserResponseDto>> {
    this.logger.log(`Creating user: ${dto.email}`, this.context);

    const createInput = UsersMapper.toCreateInput(dto);
    const user = await this.repository.create(createInput);

    this.logger.log(`User created with ID: ${user.id}`, this.context);

    return UsersMapper.toResponseDto(user);
  }

  async findAll(
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>[]> {
    const users = await this.repository.findAll(context);
    return UsersMapper.toResponseDtoList(users);
  }

  async findById(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findById(id, context);
    return UsersMapper.toResponseDto(user!);
  }

  async findByEmail(
    email: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByEmail(email, context);
    return UsersMapper.toResponseDto(user!);
  }

  async findByPhone(
    phone: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByPhone(phone, context);
    return UsersMapper.toResponseDto(user!);
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    this.logger.log(`Updating user: ${id}`, this.context);

    const updateInput = UsersMapper.toUpdateInput(dto);
    const user = await this.repository.update(id, updateInput, context);

    this.logger.log(`User updated: ${id}`, this.context);

    return UsersMapper.toResponseDto(user!);
  }

  async remove(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    this.logger.log(`Soft deleting user: ${id}`, this.context);

    const user = await this.repository.softDelete(id, context);

    this.logger.log(`User soft deleted: ${id}`, this.context);

    return UsersMapper.toResponseDto(user!);
  }

  async emailExists(email: string): Promise<boolean> {
    return this.repository.existsByEmail(email);
  }

  async phoneExists(phone: string): Promise<boolean> {
    return this.repository.existsByPhone(phone);
  }
}
