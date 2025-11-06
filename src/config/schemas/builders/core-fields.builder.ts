// src/config/schemas/core-fields.builder.ts
import * as Joi from 'joi';
import { NODE_ENV, PORT, VALID_NODE_ENVS, HOST } from '@/config/constants';

/**
 * Builds core server configuration fields schema.
 * Basic validation only - no async validators.
 */
export function buildCoreFieldsSchema(): Record<string, Joi.Schema> {
  return {
    NODE_ENV: Joi.string()
      .valid(...VALID_NODE_ENVS)
      .default(NODE_ENV),

    PORT: Joi.number().port().default(PORT),

    HOST: Joi.string().hostname().default(HOST),
  };
}
