// src/config/factory/configuration.ts
import { AppConfig } from '@/common/interfaces';
import { splitStringToArray } from '@/config/helpers';
import * as configConstant from '@/config/constants';

/**
 * Transforms environment variables into typed AppConfig object.
 * Loaded by NestConfigModule.forRoot() for DI-wide access.
 */
export function configuration(): AppConfig {
  return {
    // Application Identity
    app: {
      appName: process.env.APP_NAME || configConstant.APP_NAME,
      appVersion: process.env.APP_VERSION || configConstant.APP_VERSION,
    },

    // Server
    server: {
      nodeEnv: process.env.NODE_ENV || configConstant.NODE_ENV,
      port: parseInt(process.env.PORT || String(configConstant.PORT), 10),
      host: process.env.HOST || configConstant.HOST,
      globalPrefix: process.env.GLOBAL_PREFIX || configConstant.GLOBAL_PREFIX,
      excludePrefixArray: configConstant.EXCLUDE_PREFIX_ARRAY,
      allowedOrigins: splitStringToArray(
        process.env.ALLOWED_ORIGINS,
        configConstant.DEFAULT_ALLOWED_ORIGINS,
      ),
    },

    // Database (guaranteed by pre-validation)
    database: {
      url: process.env.DATABASE_URL!,
      maxRetries: configConstant.DATABASE_MAX_RETRIES,
      retryDelays: configConstant.DATABASE_RETRY_DELAY,
      healthCheckIntervalMs: configConstant.HEALTH_CHECK_INTERVAL_MS,
      probeCheckTimeoutMs: configConstant.PROBE_CHECK_TIMEOUT_MS,
    },

    // Security (guaranteed by pre-validation)
    jwt: {
      jwtSecret: process.env.JWT_SECRET!,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
      jwtExpiration: configConstant.JWT_EXPIRATION,
      jwtRefreshExpiration: configConstant.JWT_REFRESH_EXPIRATION,
    },
  };
}
