// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersMapper } from './users.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  
  async createUser(dto: CreateUserDto): Promise<User> {
    const data = UsersMapper.toPrismaCreate(dto);
    return this.usersRepository.create(data);
  }

  async findById(id: string): Promise<User> {
    return this.usersRepository.findByIdOrThrow(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findByEmailOrThrow(email);
  }

}
