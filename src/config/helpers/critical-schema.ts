// src/config/helpers/critical-schema.ts
import Joi from 'joi';
import { CRITICAL_ENV_VARS } from '@/common/constants';
import { configValidationSchema } from '@/config/config.schema';

export function getCriticalSchema(): Joi.ObjectSchema {
  // Map the critical vars to required in a new schema
  return Joi.object(
    Object.fromEntries(
      CRITICAL_ENV_VARS.map((key) => [
        key,
        configValidationSchema.extract(key).required(),
      ]),
    ),
  ).unknown();
}
