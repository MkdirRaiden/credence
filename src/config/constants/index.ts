// src/config/constants/index.ts

// critcal constants
export * from '@/config/constants/critical-config';

// logger constants
export const LOG_LEVEL = 'INFO';
export const VALID_LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'VERBOSE'];

// Server defaults
export const NODE_ENV = 'development';
export const VALID_NODE_ENVS = ['development', 'test', 'production'];
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

export const THROTTLER_TTL = 60000;
export const THROTTLER_LIMIT = 5;

// Environment-specific config
export const ENV_CONFIG = {
  development: {
    allowUnknown: true,
    message: 'Unknown environment variable: {#label}',
  },
  test: {
    allowUnknown: true,
    message: 'Unknown environment variable: {#label}',
  },
  production: {
    allowUnknown: false,
    message: 'Unknown environment variable: {#label}',
  },
} as const;
