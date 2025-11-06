// src/config/schemas/core-fields.builder.ts
import * as Joi from 'joi';
import { NODE_ENV, PORT, VALID_NODE_ENVS } from '@/config/factory';
import {
  validatePort,
  validateHost,
  createJoiValidator,
} from '@/config/validators';

/**
 * Builds core server configuration fields schema.
 */
export function buildCoreFieldsSchema(): Record<string, Joi.Schema> {
  return {
    NODE_ENV: Joi.string()
      .valid(...VALID_NODE_ENVS)
      .default(NODE_ENV),

    PORT: Joi.number()
      .custom(createJoiValidator<number>(validatePort, 'Invalid PORT'))
      .default(PORT),

    HOST: Joi.string()
      .custom(createJoiValidator<string>(validateHost, 'Invalid HOST'))
      .default('localhost'),
  };
}
