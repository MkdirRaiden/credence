// src/config/factory/configuration.ts
import { AppConfig, LogLevel } from '@/common/interfaces';
import { splitStringToArray } from '@/config/helpers';
import * as constants from '@/config/constants';

export function configuration(): AppConfig {
  return {
    app: {
      appName: process.env.APP_NAME || constants.APP_NAME,
      appVersion: process.env.APP_VERSION || constants.APP_VERSION,
      swaggerDescription: constants.SWAGGER_DESCRIPTION,
      apiDocsPath: constants.API_DOCS_PATH,
      logLevel: (process.env.LOG_LEVEL?.toUpperCase() ||
        constants.LOG_LEVEL) as LogLevel,
    },

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
      maxRequestSize: constants.MAX_REQUEST_SIZE,
    },

    // Database (guaranteed by pre-validation)
    database: {
      url: process.env.DATABASE_URL!,
    },

    // Security (guaranteed by pre-validation)
    jwt: {
      jwtSecret: process.env.JWT_SECRET!,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
      jwtExpiration: constants.JWT_EXPIRATION,
      jwtRefreshExpiration: constants.JWT_REFRESH_EXPIRATION,
    },

    throttle: {
      ttl: constants.THROTTLER_TTL,
      limit: constants.THROTTLER_LIMIT,
    },
  };
}
