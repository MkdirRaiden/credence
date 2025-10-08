// src/config/config.schema.ts
import * as Joi from 'joi';
import { commaSeparatedValidator } from 'src/common/utils/validation.util';
import {
  APP_NAME,
  APP_VERSION,
  DEFAULT_ALLOWED_ORIGINS,
  DEFAULT_ENV,
  DEFAULT_PORT,
  VALID_NODE_ENVS,
} from 'src/common/constants';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...VALID_NODE_ENVS)
    .default(DEFAULT_ENV),
  PORT: Joi.number().default(DEFAULT_PORT),
  DATABASE_URL: Joi.string().uri().required(),
  APP_NAME: Joi.string().default(APP_NAME).optional(),
  APP_VERSION: Joi.string().default(APP_VERSION).optional(),
  ALLOWED_ORIGINS: Joi.string()
    .custom(
      commaSeparatedValidator(
        /^https?:\/\/[a-zA-Z0-9.-]+(:\d+)?(\/.*)?$/,
        'URL',
      ),
      'Comma-separated URL validator',
    )
    .default(DEFAULT_ALLOWED_ORIGINS.join(',')),
}).unknown(true); // allow system vars
