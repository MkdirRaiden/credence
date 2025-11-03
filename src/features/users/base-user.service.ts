// src/features/users/base-user.service.ts
import { CreateUserDto, UserResponseDto } from '@/features/users/dtos';
import { User } from '@prisma/client';

/**
 * Abstract base service for UserService.
 * Defines contract for Auth module (interface segregation).
 * Only exposes methods needed by Auth: create, findByEmailForAuth.
 */
export abstract class BaseUserService {
  /**
   * Create a new user (used by Auth register).
   */
  abstract create(
    dto: CreateUserDto & { passwordHash?: string },
  ): Promise<UserResponseDto>;

  /**
   * Find full user by email for auth verification.
   * Returns User with passwordHash and refreshTokens (bypasses visibility).
   */
  abstract findByEmailForAuth(email: string): Promise<User>;
}
