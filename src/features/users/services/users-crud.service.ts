// src/features/users/services/users-crud.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { UsersCrudRepository } from '@/features/users/repositories';
import { UsersConflictService } from '@/features/users/services/internals';
import { CreateUserDto, UpdateUserDto } from '@/features/users/dtos';
import * as UsersMapper from '@/features/users/mappers';
import { BaseCrudService } from '@/features/users/contracts';
import { LOG_CONTEXTS } from '@/common/constants';
import { DeletedResourceDto, UserResponseDto } from '@/features/users/dtos';

@Injectable()
export class UsersCrudService extends BaseCrudService {
  constructor(
    private readonly repository: UsersCrudRepository,
    private readonly conflictService: UsersConflictService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async create(
    dto: CreateUserDto & { passwordHash?: string },
  ): Promise<UserResponseDto> {
    this.logger.log(`Creating user: ${dto.email}`, LOG_CONTEXTS.USER);

    await this.conflictService.ensureCreateConstraints(dto);

    const createInput = UsersMapper.toCreateInput(dto);
    const user = await this.repository.create(createInput);

    this.logger.log(`User created with ID: ${user.id}`, LOG_CONTEXTS.USER);
    return UsersMapper.toResponseDto(user) as UserResponseDto;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user: ${id}`, LOG_CONTEXTS.USER);

    await this.conflictService.ensureUpdateConstraints(id, dto);

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
