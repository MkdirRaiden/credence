import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersMapper } from './users.mapper';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // Create user and return response DTO
  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    const data = UsersMapper.toPrismaCreate(dto);
    const user = await this.usersRepository.create(data);
    return UsersMapper.toResponse(user);
  }

  // Find by ID
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(id);
    return UsersMapper.toResponse(user);
  }

  // Find by email
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findByEmail(email);
    return UsersMapper.toResponse(user);
  }
}
