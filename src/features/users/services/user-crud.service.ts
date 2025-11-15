// src/features/users/services/user-crud.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { UsersCrudRepository } from '@/features/users/repositories';
import { CreateUserDto } from '@/features/users/dtos';
import * as UsersMapper from '@/features/users/mappers';
import { BaseCrudService } from '@/features/users/contracts';
import { LOG_CONTEXTS } from '@/common/constants';
import {
  DeletedResourceDto,
  UserResponseDto,
  UpdateUserDto,
} from '@/features/users/dtos';

/**
 * User creation, update, deletion operations
 */
@Injectable()
export class UserCrudService extends BaseCrudService {
  constructor(
    private readonly repository: UsersCrudRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async create(
    dto: CreateUserDto & { passwordHash?: string },
  ): Promise<UserResponseDto> {
    this.logger.log(`Creating user: ${dto.email}`, LOG_CONTEXTS.USER);
    const createInput = UsersMapper.toCreateInput(dto);
    const user = await this.repository.create(createInput);
    this.logger.log(`User created with ID: ${user.id}`, LOG_CONTEXTS.USER);
    return UsersMapper.toResponseDto(user) as UserResponseDto;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user: ${id}`, LOG_CONTEXTS.USER);
    const updateInput = UsersMapper.toUpdateInput(dto);
    const user = await this.repository.update(id, updateInput);
    this.logger.log(`User updated: ${id}`, LOG_CONTEXTS.USER);
    return UsersMapper.toResponseDto(user) as UserResponseDto;
  }

  async remove(id: string): Promise<DeletedResourceDto> {
    this.logger.log(`Soft deleting user: ${id}`, LOG_CONTEXTS.USER);
    const deleted = await this.repository.softDelete(id);
    this.logger.log(`User soft deleted: ${id}`, LOG_CONTEXTS.USER);
    return deleted;
  }
}
