// src/config/config.schema.ts
import * as Joi from 'joi';
import { APP_NAME, APP_VERSION, DEFAULT_ENV, DEFAULT_PORT, VALID_NODE_ENVS } from 'src/common/constants';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(...VALID_NODE_ENVS).default(DEFAULT_ENV),
  PORT: Joi.number().default(DEFAULT_PORT),
  DATABASE_URL: Joi.string().uri().required(),
  SHADOW_DATABASE_URL: Joi.string().uri().optional(),
  APP_NAME: Joi.string().default(APP_NAME).optional(),
  APP_VERSION: Joi.string().default(APP_VERSION).optional(),
}).unknown(true); // allow system vars
