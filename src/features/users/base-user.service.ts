// src/features/users/base-user.service.ts
import { CreateUserDto, UserResponseDto } from '@/features/users/dtos';
import { User } from '@prisma/client';

/**
 * Abstract class for UserService
 * Defines contract for Auth module (interface segregation)
 * Only exposes methods needed by Auth: create, findByEmailForAuth
 */
export abstract class BaseUserService {
  /**
   * Create a new user (used by register)
   * @param dto - CreateUserDto with optional passwordHash
   */
  abstract create(
    dto: CreateUserDto & { passwordHash?: string },
  ): Promise<UserResponseDto>;

  /**
   * Find full user by email for auth verification
   * Returns full User with passwordHash and refreshTokens
   * Bypasses visibility rules—internal use only
   * Used by login/refresh to verify credentials and tokens
   */
  abstract findByEmailForAuth(email: string): Promise<User>;
}
