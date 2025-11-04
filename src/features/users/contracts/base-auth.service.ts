// src/features/users/contracts/base-auth.service.ts
import { User } from '@prisma/client';

/**
 * Contract for user authentication services.
 * Defines methods needed for auth verification and lookups.
 * Implemented by: UserAuthService, PhoneAuthService (Phase 5), OAuth2AuthService (Phase 6)
 */
export abstract class BaseAuthService {
  /**
   * Find full user by email for auth verification
   * Returns User with passwordHash and refreshTokens (bypasses visibility)
   */
  abstract findByEmailForAuth(email: string): Promise<User>;

  /**
   * Find full user by username for auth verification
   * Returns User with passwordHash and refreshTokens (bypasses visibility)
   */
  abstract findByUsernameForAuth(username: string): Promise<User>;
}
