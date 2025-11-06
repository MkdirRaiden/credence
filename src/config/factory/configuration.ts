// src/config/factory/configuration.ts
import { AppConfig } from '@/common/interfaces';
import { splitStringToArray } from '@/config/helpers';
import {
  APP_NAME,
  APP_VERSION,
  NODE_ENV,
  PORT,
  DEFAULT_ALLOWED_ORIGINS,
  GLOBAL_PREFIX,
  HOST,
} from '@/config/factory'; // ← Import from factory, not common!

/**
 * Transforms environment variables into typed AppConfig object.
 * Loaded by NestConfigModule.forRoot() for DI-wide access.
 */
export function configuration(): AppConfig {
  return {
    // Application Identity
    nodeEnv: process.env.NODE_ENV || NODE_ENV,
    appName: process.env.APP_NAME || APP_NAME,
    appVersion: process.env.APP_VERSION || APP_VERSION,

    // Server
    port: parseInt(process.env.PORT || String(PORT), 10),
    host: process.env.HOST || HOST,
    globalPrefix: process.env.GLOBAL_PREFIX || GLOBAL_PREFIX,

    // Database (guaranteed by pre-validation)
    database: { url: process.env.DATABASE_URL! },

    // Security (guaranteed by pre-validation)
    jwtSecret: process.env.JWT_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,

    // CORS
    allowedOrigins: splitStringToArray(
      process.env.ALLOWED_ORIGINS,
      DEFAULT_ALLOWED_ORIGINS,
    ),
  };
}
