// src/config/schemas/builders/security-fields.builder.ts
import * as Joi from 'joi';
import { validateJwtSecret, createJoiValidator } from '@/config/validators';

/**
 * Builds security configuration fields schema (JWT).
 */
export function buildSecurityFieldsSchema(): Record<string, Joi.Schema> {
  return {
    JWT_SECRET: Joi.string()
      .trim()
      .custom(
        createJoiValidator<string>(validateJwtSecret, 'Invalid JWT_SECRET'),
      )
      .required(),

    JWT_REFRESH_SECRET: Joi.string()
      .trim()
      .custom(
        createJoiValidator<string>(
          validateJwtSecret,
          'Invalid JWT_REFRESH_SECRET',
        ),
      )
      .required(),
  };
}
