// src/features/users/contracts/base-auth.service.ts
import { User } from '@prisma/client';

/**
 * Contract for user authentication services.
 * Defines methods needed for auth verification and lookups.
 * Implemented by: UserAuthService, PhoneAuthService (Phase 5), OAuth2AuthService (Phase 6)
 */
export abstract class BaseAuthService {
  abstract findByEmailForAuth(email: string): Promise<User>;

  abstract findByUsernameForAuth(username: string): Promise<User>;
}
