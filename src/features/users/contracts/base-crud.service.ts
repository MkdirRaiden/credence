// src/features/users/contracts/base-crud.service.ts
import { CreateUserDto, UserResponseDto } from '@/features/users/dtos';

/**
 * Contract for user creation service.
 * Defines methods needed for user creation (e.g., during registration).
 * Implemented by: UserCrudService, and future variants (TenantAwareCrudService, etc.)
 */
export abstract class BaseCrudService {
  /**
   * Create a new user with optional password hash
   * Used by: AuthModule.register(), admin user creation
   */
  abstract create(
    dto: CreateUserDto & { passwordHash?: string },
  ): Promise<UserResponseDto>;
}
