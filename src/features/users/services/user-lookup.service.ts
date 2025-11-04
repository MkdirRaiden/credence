// src/features/users/services/user-lookup.service.ts
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/features/users/repositories/users.repository';
import { UserResponseDto } from '@/features/users/dtos';
import { FieldSelectorContext } from '@/common/interfaces';
import * as UsersMapper from '@/features/users/mappers';

/**
 * User lookup operations with visibility context
 */
@Injectable()
export class UserLookupService {
  constructor(private readonly repository: UsersRepository) {}

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
    return UsersMapper.toResponseDto(user);
  }

  async findByEmail(
    email: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByEmail(email, context);
    return UsersMapper.toResponseDto(user);
  }

  async findByUsername(
    username: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByUsername(username, context);
    return UsersMapper.toResponseDto(user);
  }

  async findByPhone(
    phone: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>> {
    const user = await this.repository.findByPhone(phone, context);
    return UsersMapper.toResponseDto(user);
  }
}
