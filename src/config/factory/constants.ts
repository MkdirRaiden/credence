// src/config/factory/constants.ts
/**
 * Configuration-specific constants.
 * Used by config validation, builders, schema, and loaders.
 */

// Server defaults
export const NODE_ENV = 'development';
export const PORT = 5000;
export const HOST = 'localhost';
export const GLOBAL_PREFIX = 'api/v1';
export const EXCLUDE_PREFIX_ARRAY = ['/', 'health/live', 'health/ready'];

// Application defaults
export const APP_NAME = 'Credence API';
export const APP_VERSION = '1.0.0';
export const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000'];

// JWT defaults
export const JWT_EXPIRATION = 900; // 15 minutes
export const JWT_REFRESH_EXPIRATION = 604800; // 7 days

// Database related
export const DATABASE_MAX_RETRIES = 5;
export const DATABASE_RETRY_DELAY = 2000;
export const SHUTDOWN_TIMEOUT_MS = 200;
export const HEALTH_CHECK_INTERVAL_MS = 60000;
export const PROBES_TOKEN = Symbol('PROBES');
export const PROBE_CHECK_TIMEOUT_MS = 5000;

// Validation
export const CRITICAL_ENV_VARS = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

export const VALID_NODE_ENVS = ['development', 'test', 'production'];

// Environment-specific config
export const ENV_CONFIG = {
  development: {
    allowUnknown: true,
    message: '⚠️  Unknown env var: {#label}',
  },
  test: {
    allowUnknown: false,
    message: 'Unknown env var: {#label}',
  },
  production: {
    allowUnknown: false,
    message: 'Unknown env var: {#label}',
  },
} as const;
