// src/features/auth/constants/index.ts
/**
 * Validation constraints for authentication fields.
 */

export { JWT_EXPIRATION, JWT_REFRESH_EXPIRATION } from '@/config/constants';

export const AUTH_VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
  LOGIN_IDENTIFIER_MIN_LENGTH: 1,
  TOKEN_MIN_LENGTH: 10,
} as const;
