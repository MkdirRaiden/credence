// src/config/schemas/critical-schema.ts
import * as Joi from 'joi';
import { CRITICAL_ENV_VARS } from '@/config/factory';
import { configValidationSchema } from '@/config/schemas';

/**
 * Extracts critical environment variables schema for pre-validation.
 * Fails fast before DI container initializes if required vars are missing.
 */
export function getCriticalSchema(): Joi.ObjectSchema {
  // Extract ONLY critical vars - no need to worry about unknowns
  return Joi.object(
    Object.fromEntries(
      CRITICAL_ENV_VARS.map((key) => [
        key,
        configValidationSchema.extract(key).required(),
      ]),
    ),
  );
}
