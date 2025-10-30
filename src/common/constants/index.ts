//src/common/constants/index.ts
// config constants
export const CRITICAL_ENV_VARS = ['NODE_ENV', 'DATABASE_URL'];
export const VALID_NODE_ENVS = ['development', 'test', 'production'];

// server constants
export const NODE_ENV = 'development';
export const PORT = 5000;
export const HOST = 'localhost';
export const GLOBAL_PREFIX = 'api/v1';
export const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000'];
export const EXCLUDE_PREFIX_ARRAY = [
  '/',
  'health',
  'health/live',
  'health/ready',
];

// application constants
export const APP_NAME = 'Credence API';
export const APP_VERSION = '1.0.0';
export const DEFAULT_CONTEXT = 'App';
export const SHUTDOWN_TIMEOUT_MS = 200; // 200 ms
export const HEALTH_CHECK_INTERVAL_MS = 60000; // 1 minute
// database constants
export const DATABASE_MAX_RETRIES = 5;
export const DATABASE_RETRY_DELAY = 2000; // in ms
// featurs constants
export const DEFAULT_PAGINATION_TAKE = 10;
export const DEFAULT_PAGINATION_SKIP = 0;
export const DEFAULT_USER = 'USER';
export const VISIBILITY_KEY = 'visibility-level';
