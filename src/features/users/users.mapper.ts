import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';

export class UsersMapper {
  // DTO -> Prisma input
  static toPrismaCreate(dto: CreateUserDto): Prisma.UserCreateInput {
    return {
      email: '',
      phone: dto.phone,
    };
  }

  // Prisma entity -> API response DTO
  static toResponse(user: User): UserResponseDto {
    return {
      phone: user.phone ?? undefined,
    };
  }
}
