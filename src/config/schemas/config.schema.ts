import * as Joi from 'joi';
import { ENV_CONFIG, NODE_ENV } from '@/config/factory';
import {
  buildCoreFieldsSchema,
  buildDatabaseFieldsSchema,
  buildSecurityFieldsSchema,
  buildCorsFieldsSchema,
  buildAppFieldsSchema,
} from '@/config/schemas/builders';

/**
 * Composes all schema builders into complete config schema.
 * Environment-specific validation behavior from ENV_CONFIG.
 */
function buildConfigSchema(): Joi.ObjectSchema {
  const env = (process.env.NODE_ENV || NODE_ENV) as keyof typeof ENV_CONFIG;
  const envConfig = ENV_CONFIG[env] || ENV_CONFIG.development;

  const baseSchema = Joi.object({
    ...buildCoreFieldsSchema(),
    ...buildDatabaseFieldsSchema(),
    ...buildSecurityFieldsSchema(),
    ...buildCorsFieldsSchema(),
    ...buildAppFieldsSchema(),
  });

  return baseSchema.unknown(envConfig.allowUnknown).messages({
    'object.unknown': envConfig.message,
  });
}

/**
 * Single source of truth for config validation.
 * Used by both NestConfigModule and critical schema extraction.
 */
export const configValidationSchema = buildConfigSchema();
