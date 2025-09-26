import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';

export class UsersMapper {
  // DTO -> Prisma input
  static toPrismaCreate(dto: CreateUserDto): Prisma.UserCreateInput {
    return {
      email: dto.email,
      phone: dto.phone,
      referralCode: dto.referralCode,
    };
  }

  // Prisma entity -> API response DTO
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone ?? undefined,
      referralCode: user.referralCode ?? undefined,
      createdAt: user.createdAt,
    };
  }
}
