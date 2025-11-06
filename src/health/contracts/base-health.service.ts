// src/health/contracts/base-health.service.ts

/**
 * Contract for user creation service.
 * Defines methods needed for user creation (e.g., during registration).
 * Implemented by: UserCrudService, and future variants (TenantAwareCrudService, etc.)
 */
export abstract class BaseHealthService {
  /**
   * Create a new user with optional password hash
   * Used by: AuthModule.register(), admin user creation
   */
  abstract assertReadiness(): Promise<void>;
}
