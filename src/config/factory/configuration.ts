// src/config/factory/configuration.ts
import { AppConfig } from '@/common/interfaces';
import { splitStringToArray } from '@/config/helpers';
import * as constants from '@/config/constants';
import { LogLevel } from '@/common/interfaces';

/**
 * Transforms environment variables into typed AppConfig object.
 * Loaded by NestConfigModule.forRoot() for DI-wide access.
 */
export function configuration(): AppConfig {
  return {
    // Application Identity
    app: {
      appName: process.env.APP_NAME || constants.APP_NAME,
      appVersion: process.env.APP_VERSION || constants.APP_VERSION,
      logLevel: (process.env.LOG_LEVEL?.toUpperCase() ||
        constants.LOG_LEVEL) as LogLevel,
    },

    // Server
    server: {
      nodeEnv: process.env.NODE_ENV || constants.NODE_ENV,
      port: parseInt(process.env.PORT || String(constants.PORT), 10),
      host: process.env.HOST || constants.HOST,
      globalPrefix: process.env.GLOBAL_PREFIX || constants.GLOBAL_PREFIX,
      excludePrefixArray: constants.EXCLUDE_PREFIX_ARRAY,
      allowedOrigins: splitStringToArray(
        process.env.ALLOWED_ORIGINS,
        constants.DEFAULT_ALLOWED_ORIGINS,
      ),
    },

    // Database (guaranteed by pre-validation)
    database: {
      url: process.env.DATABASE_URL!,
      maxRetries: constants.DATABASE_MAX_RETRIES,
      retryDelays: constants.DATABASE_RETRY_DELAY,
      healthCheckIntervalMs: constants.HEALTH_CHECK_INTERVAL_MS,
      probeCheckTimeoutMs: constants.PROBE_CHECK_TIMEOUT_MS,
    },

    // Security (guaranteed by pre-validation)
    jwt: {
      jwtSecret: process.env.JWT_SECRET!,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
      jwtExpiration: constants.JWT_EXPIRATION,
      jwtRefreshExpiration: constants.JWT_REFRESH_EXPIRATION,
    },
  };
}
