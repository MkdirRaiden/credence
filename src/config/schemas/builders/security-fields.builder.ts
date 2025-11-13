// src/config/schemas/builders/security-fields.builder.ts
import * as Joi from 'joi';
import { THROTTLER_LIMIT, THROTTLER_TTL } from '@/config/constants';

/**
 * Builds security configuration fields schema (JWT).
 */
export function buildSecurityFieldsSchema(): Record<string, Joi.Schema> {
  return {
    JWT_SECRET: Joi.string().trim().required(),
    JWT_REFRESH_SECRET: Joi.string().trim().required(),

    THROTTLER_TTL: Joi.number().default(THROTTLER_TTL),
    THROTTLER_LIMIT: Joi.number().default(THROTTLER_LIMIT),
  };
}
