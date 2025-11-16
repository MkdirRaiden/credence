// src/config/constants/application-config.ts
export const LOG_LEVEL = 'INFO';
export const VALID_LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'VERBOSE'];

export const APP_NAME = 'Credence API';
export const APP_VERSION = '1.0.0';
export const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:3000'];

export const JWT_EXPIRATION = 900; // 15 minutes
export const JWT_REFRESH_EXPIRATION = 604_800; // 7 days

export const THROTTLER_TTL = 60_000;
export const THROTTLER_LIMIT = 100;
