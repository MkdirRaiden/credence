// src/features/users/services/user-crud.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { UsersCrudRepository } from '@/features/users/repositories';
import * as userDtos from '@/features/users/dtos';
import { DeletedResourceDto } from '@/common/dtos';
import * as UsersMapper from '@/features/users/mappers';
import { BaseCrudService } from '@/features/users/contracts';

/**
 * User creation, update, deletion operations
 */
@Injectable()
export class UserCrudService extends BaseCrudService {
  private readonly logContext = 'UserCrudService';

  constructor(
    private readonly repository: UsersCrudRepository,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async create(
    dto: userDtos.CreateUserDto & { passwordHash?: string },
  ): Promise<userDtos.UserResponseDto> {
    this.logger.log(`Creating user: ${dto.email}`, this.logContext);
    const createInput = UsersMapper.toCreateInput(dto);
    const user = await this.repository.create(createInput);
    this.logger.log(`User created with ID: ${user.id}`, this.logContext);
    return UsersMapper.toResponseDto(user) as userDtos.UserResponseDto;
  }

  async update(id: string, dto: userDtos.UpdateUserDto): Promise<userDtos.UserResponseDto> {
    this.logger.log(`Updating user: ${id}`, this.logContext);
    const updateInput = UsersMapper.toUpdateInput(dto);
    const user = await this.repository.update(id, updateInput);
    this.logger.log(`User updated: ${id}`, this.logContext);
    return UsersMapper.toResponseDto(user) as userDtos.UserResponseDto;
  }

  async remove(id: string): Promise<DeletedResourceDto> {
    this.logger.log(`Soft deleting user: ${id}`, this.logContext);
    const deleted = await this.repository.softDelete(id);
    this.logger.log(`User soft deleted: ${id}`, this.logContext);
    return deleted;
  }
}
