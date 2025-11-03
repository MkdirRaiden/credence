// src/common/constants/index.ts

// Configuration validation
export const CRITICAL_ENV_VARS = [
  'NODE_ENV',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];
export const VALID_NODE_ENVS = ['development', 'test', 'production'];

// Server
export const NODE_ENV = 'development';
export const PORT = 5000;
export const HOST = 'localhost';
export const GLOBAL_PREFIX = 'api/v1';
export const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000'];
export const EXCLUDE_PREFIX_ARRAY = [
  '/',
  'health/live',
  'health/ready',
];

// Application
export const APP_NAME = 'Credence API';
export const APP_VERSION = '1.0.0';
export const DEFAULT_CONTEXT = 'App';
export const SHUTDOWN_TIMEOUT_MS = 200;
export const HEALTH_CHECK_INTERVAL_MS = 60000;

// Database
export const PROBES_TOKEN = Symbol('PROBES');
export const PRISMA_PROBE_TIMEOUT_MS = 5000;
export const DATABASE_MAX_RETRIES = 5;
export const DATABASE_RETRY_DELAY = 2000;

// Features
export const DEFAULT_USER = 'USER';
export const VISIBILITY_KEY = 'visibility-level';
export const JWT_EXPIRATION = 900; // 15 minutes
export const JWT_REFRESH_EXPIRATION = 604800; // 7 days
