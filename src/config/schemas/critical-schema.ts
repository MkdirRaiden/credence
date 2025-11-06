// src/config/schemas/critical-schema.ts
import * as Joi from 'joi';
import { configValidationSchema } from '@/config/schemas';
import { createExternalValidator } from '@/config/validators';
import { CRITICAL_ENV_VARS, CRITICAL_VALIDATORS } from '@/config/constants';

export function getCriticalSchema(): Joi.ObjectSchema {
  return Joi.object(
    Object.fromEntries(
      CRITICAL_ENV_VARS.map((key) => [
        key,
        configValidationSchema
          .extract(key)
          .external(
            createExternalValidator(CRITICAL_VALIDATORS[key], `Invalid ${key}`),
          ),
      ]),
    ),
  ).unknown(true);
}
