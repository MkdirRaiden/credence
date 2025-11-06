// src/config/schemas/builders/database-fields.builder.ts
import * as Joi from 'joi';

/**
 * Builds database configuration fields schema.
 */
export function buildDatabaseFieldsSchema(): Record<string, Joi.Schema> {
  return {
    DATABASE_URL: Joi.string().required(),
  };
}
