import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';
import { UsersRepository } from '@/features/users/repositories/users.repository';
import { CreateUserDto } from '@/features/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/features/users/dtos/update-user.dto';
import { UserResponseDto } from '@/features/users/dtos/user-response.dto';
import * as UsersMapper from '@/features/users/mappers/users.mapper';

@Injectable()
export class UsersService {
  private readonly context = 'UsersService';

  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: LoggerService,
  ) {}

  // Create a new user
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user: ${dto.email}`, this.context);

    // Map DTO to Prisma input
    const createInput = UsersMapper.toCreateInput(dto);

    // Create user in database
    const user = await this.repository.create(createInput);

    this.logger.log(`User created with ID: ${user.id}`, this.context);

    // Return response DTO
    return UsersMapper.toResponseDto(user);
  }

  // Get all users with pagination
  async findAll(skip = 0, take = 10): Promise<UserResponseDto[]> {
    const users = await this.repository.findAll(skip, take);
    return UsersMapper.toResponseDtoList(users);
  }

  // Get user by ID
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.repository.findById(id);
    return UsersMapper.toResponseDto(user!);
  }

  // Get user by email
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.repository.findByEmail(email);
    return UsersMapper.toResponseDto(user!);
  }

  // Get user by phone
  async findByPhone(phone: string): Promise<UserResponseDto> {
    const user = await this.repository.findByPhone(phone);
    return UsersMapper.toResponseDto(user!);
  }

  // Update user by ID
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user: ${id}`, this.context);

    // Map DTO to Prisma update input
    const updateInput = UsersMapper.toUpdateInput(dto);

    // Update user in database
    const user = await this.repository.update(id, updateInput);

    this.logger.log(`User updated: ${id}`, this.context);

    // Return response DTO
    return UsersMapper.toResponseDto(user!);
  }

  // Soft delete user by ID
  async remove(id: string): Promise<UserResponseDto> {
    this.logger.log(`Soft deleting user: ${id}`, this.context);

    const user = await this.repository.softDelete(id);

    this.logger.log(`User soft deleted: ${id}`, this.context);

    return UsersMapper.toResponseDto(user!);
  }

  // Check if email is already taken
  async emailExists(email: string): Promise<boolean> {
    return this.repository.existsByEmail(email);
  }

  // Check if phone is already taken
  async phoneExists(phone: string): Promise<boolean> {
    return this.repository.existsByPhone(phone);
  }
}
