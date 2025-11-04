// src/config/config.schema.ts
import * as Joi from 'joi';
import {
  DEFAULT_ALLOWED_ORIGINS,
  NODE_ENV,
  PORT,
  VALID_NODE_ENVS,
  APP_NAME,
  APP_VERSION,
} from '@/common/constants';

/**
 * Joi validation schema for application configuration.
 * Two-phase validation: getCriticalSchema() in main.ts, then full schema here during DI.
 */
export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...VALID_NODE_ENVS)
    .default(NODE_ENV),

  PORT: Joi.number().default(PORT),

  // PostgreSQL connection string only
  DATABASE_URL: Joi.string()
    .uri()
    .pattern(/^postgres(ql)?:\/\/.+$/, 'PostgreSQL URI required')
    .required(),

  APP_NAME: Joi.string().trim().default(APP_NAME),

  APP_VERSION: Joi.string().trim().default(APP_VERSION),

  // Comma-separated CORS origins with protocol validation
  ALLOWED_ORIGINS: Joi.string()
    .pattern(
      /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?(\/.*)?(,[^,]+)*$/,
      'comma-separated URLs',
    )
    .default(DEFAULT_ALLOWED_ORIGINS.join(',')),

  JWT_SECRET: Joi.string().trim().required(),

  JWT_REFRESH_SECRET: Joi.string().trim().required(),
}).unknown(true);
