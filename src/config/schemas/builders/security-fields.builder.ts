// src/config/schemas/builders/security-fields.builder.ts
import * as Joi from 'joi';

/**
 * Builds security configuration fields schema (JWT).
 */
export function buildSecurityFieldsSchema(): Record<string, Joi.Schema> {
  return {
    JWT_SECRET: Joi.string().trim().required(),

    JWT_REFRESH_SECRET: Joi.string().trim().required(),
  };
}
