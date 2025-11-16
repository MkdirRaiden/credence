// src/features/users/services/users-lookup.service.ts
import { Injectable } from '@nestjs/common';
import { UsersLookupRepository } from '@/features/users/repositories';
import { UserResponseDto } from '@/features/users/dtos';
import { FieldSelectorContext } from '@/common/interfaces';
import * as UsersMapper from '@/features/users/mappers';
import { BaseLookupService } from '@/features/users/contracts';

/**
 * User lookup operations with visibility context
 */
@Injectable()
export class UsersLookupService extends BaseLookupService {
  constructor(private readonly repository: UsersLookupRepository) {
    super();
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
