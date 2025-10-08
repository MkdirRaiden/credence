//src/common/constants/index.ts
export const APP_NAME = 'Credence API';
export const APP_VERSION = '1.0.0';
export const DEFAULT_ENV = 'development';
export const DEFAULT_PORT = 5000;
export const DATABASE_MAX_RETRIES = 5;
export const DATABASE_RETRY_DELAY = 2000; // in ms
export const DEFAULT_CONTEXT = 'App';
export const HEALTH_CHECK_INTERVAL_MS = 60000; // 1 minute
export const SHUTDOWN_TIMEOUT_MS = 200; // 200 ms
export const VALID_NODE_ENVS = ['development', 'staging', 'production'];
export const CRITICAL_ENV_VARS = ['NODE_ENV', 'DATABASE_URL'];
export const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000'];
