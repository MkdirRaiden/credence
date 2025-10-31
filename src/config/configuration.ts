// src/config/configuration.ts
import {
  APP_NAME,
  APP_VERSION,
  NODE_ENV,
  PORT,
  DEFAULT_ALLOWED_ORIGINS,
  GLOBAL_PREFIX,
  HOST,
} from '@/common/constants';
import { AppConfig } from '@/common/interfaces/app-config.interface';
import { splitStringToArray } from '@/config/helpers';

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || NODE_ENV,
  port: parseInt(process.env.PORT || String(PORT), 10),
  appName: process.env.APP_NAME || APP_NAME,
  host: process.env.HOST || HOST,
  appVersion: process.env.APP_VERSION || APP_VERSION,
  globalPrefix: process.env.GLOBAL_PREFIX || GLOBAL_PREFIX,
  database: { url: process.env.DATABASE_URL! }, // guaranteed by pre-validation
  allowedOrigins: splitStringToArray(
    process.env.ALLOWED_ORIGINS,
    DEFAULT_ALLOWED_ORIGINS,
  ),
});
