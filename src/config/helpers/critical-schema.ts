// src/config/helpers/critical-schema.ts
import Joi from 'joi';
import { CRITICAL_ENV_VARS } from '@/common/constants';
import { configValidationSchema } from '@/config/config.schema';

/**
 * Extracts critical environment variables schema for pre-validation.
 * Fails fast before DI container initializes if required vars are missing.
 */
export function getCriticalSchema(): Joi.ObjectSchema {
  return Joi.object(
    Object.fromEntries(
      CRITICAL_ENV_VARS.map((key) => [
        key,
        configValidationSchema.extract(key).required(),
      ]),
    ),
  ).unknown();
}
