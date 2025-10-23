// src/config/config.schema.ts
import * as Joi from 'joi';
import { commaSeparatedValidator } from '@/common/utils';
import { DEFAULT_ALLOWED_ORIGINS, NODE_ENV, PORT, VALID_NODE_ENVS, APP_NAME, APP_VERSION } from '@/common/constants';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(...VALID_NODE_ENVS).default(NODE_ENV),
  PORT: Joi.number().default(PORT),
  DATABASE_URL: Joi.string().uri().required(),
  APP_NAME: Joi.string().default(APP_NAME),
  APP_VERSION: Joi.string().default(APP_VERSION),
  ALLOWED_ORIGINS: Joi.any()
    .custom(
      commaSeparatedValidator(/^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?(\/.*)?$/, 'URL')
    )
    .default(DEFAULT_ALLOWED_ORIGINS.join(',')), // simple string default
}).unknown(true);
