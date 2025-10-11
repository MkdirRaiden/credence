// src/config/configuration.ts
import {
  APP_NAME,
  APP_VERSION,
  DEFAULT_ENV,
  DEFAULT_PORT,
  DEFAULT_ALLOWED_ORIGINS,
  GLOBAL_PREFIX,
} from 'src/common/constants';

// App config factory
export default () => ({
  nodeEnv: process.env.NODE_ENV || DEFAULT_ENV,
  port: parseInt(process.env.PORT || String(DEFAULT_PORT), 10),
  appName: process.env.APP_NAME || APP_NAME,
  appVersion: process.env.APP_VERSION || APP_VERSION,
  globalPrefix: process.env.GLOBAL_PREFIX || GLOBAL_PREFIX,
  database: {
    url: process.env.DATABASE_URL, // guaranteed by Joi validation
  },
  allowedOrigins:
    process.env.ALLOWED_ORIGINS?.split(',') || DEFAULT_ALLOWED_ORIGINS,
});
