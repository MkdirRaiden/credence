// src/config/schemas/builders/database-fields.builder.ts
import * as Joi from 'joi';
import { validateDatabaseUrl, createJoiValidator } from '@/config/validators';

/**
 * Builds database configuration fields schema.
 */
export function buildDatabaseFieldsSchema(): Record<string, Joi.Schema> {
  return {
    DATABASE_URL: Joi.string()
      .custom(
        createJoiValidator<string>(validateDatabaseUrl, 'Invalid DATABASE_URL'),
      )
      .required(),
  };
}
