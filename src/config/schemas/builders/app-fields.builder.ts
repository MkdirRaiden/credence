// src/config/schemas/builders/app-fields.builder.ts
import * as Joi from 'joi';
import {
  APP_NAME,
  APP_VERSION,
  VALID_LOG_LEVELS,
  LOG_LEVEL,
} from '@/config/constants';

/**
 * Builds application metadata configuration fields schema.
 */
export function buildAppFieldsSchema(): Record<string, Joi.Schema> {
  return {
    APP_NAME: Joi.string().trim().default(APP_NAME),
    APP_VERSION: Joi.string().trim().default(APP_VERSION),
    LOG_LEVEL: Joi.string()
      .valid(...VALID_LOG_LEVELS)
      .uppercase()
      .default(LOG_LEVEL),
  };
}
