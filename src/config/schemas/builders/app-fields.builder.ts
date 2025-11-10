// src/config/schemas/builders/app-fields.builder.ts
import * as Joi from 'joi';
import * as constants from '@/config/constants';

/**
 * Builds application metadata configuration fields schema.
 */
export function buildAppFieldsSchema(): Record<string, Joi.Schema> {
  return {
    APP_NAME: Joi.string().trim().default(constants.APP_NAME),
    APP_VERSION: Joi.string().trim().default(constants.APP_VERSION),
    LOG_LEVEL: Joi.string()
      .valid(...constants.VALID_LOG_LEVELS)
      .uppercase()
      .default(constants.LOG_LEVEL),
  };
}
