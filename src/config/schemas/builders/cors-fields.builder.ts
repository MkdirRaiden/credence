// src/config/schemas/cors-fields.builder.ts
import * as Joi from 'joi';
import { DEFAULT_ALLOWED_ORIGINS } from '@/config/factory';
import {
  validateAllowedOrigins,
  createJoiValidator,
} from '@/config/validators';

/**
 * Builds CORS configuration fields schema.
 */
export function buildCorsFieldsSchema(): Record<string, Joi.Schema> {
  return {
    ALLOWED_ORIGINS: Joi.string()
      .custom(
        createJoiValidator<string>(
          validateAllowedOrigins,
          'Invalid CORS origins',
        ),
      )
      .default(DEFAULT_ALLOWED_ORIGINS.join(',')),
  };
}
