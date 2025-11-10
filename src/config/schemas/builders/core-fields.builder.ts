// src/config/schemas/core-fields.builder.ts
import * as Joi from 'joi';
import * as constants from '@/config/constants';

/**
 * Builds core server configuration fields schema.
 * Basic validation only - no async validators.
 */
export function buildCoreFieldsSchema(): Record<string, Joi.Schema> {
  return {
    NODE_ENV: Joi.string()
      .valid(...constants.VALID_NODE_ENVS)
      .default(constants.NODE_ENV),

    PORT: Joi.number().port().default(constants.PORT),

    HOST: Joi.string().hostname().default(constants.HOST),
  };
}
