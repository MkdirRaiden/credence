// src/config/validators/critical-config.ts

import { validateJwtSecret, validateDatabaseUrl } from '@/config/validators';

/**
 * Critical environment variables that MUST be set before app starts.
 * Mapped to their validators for pre-validation in main.ts.
 */
export const CRITICAL_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

export const CRITICAL_VALIDATORS = {
  DATABASE_URL: validateDatabaseUrl,
  JWT_SECRET: validateJwtSecret,
  JWT_REFRESH_SECRET: validateJwtSecret,
} as const;

export type CriticalValidatorKey = (typeof CRITICAL_ENV_VARS)[number];
