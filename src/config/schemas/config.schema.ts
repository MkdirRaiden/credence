// src/config/schemas/config.schema.ts
import * as Joi from 'joi';
import { ENV_CONFIG, NODE_ENV } from '@/config/constants';
import * as builders from '@/config/schemas/builders';

/**
 * Composes all schema builders into complete config schema.
 * Environment-specific validation behavior from ENV_CONFIG.
 */
function buildConfigSchema(): Joi.ObjectSchema {
  const env = (process.env.NODE_ENV || NODE_ENV) as keyof typeof ENV_CONFIG;
  const envConfig = ENV_CONFIG[env] || ENV_CONFIG.development;

  const baseSchema = Joi.object({
    ...builders.buildCoreFieldsSchema(),
    ...builders.buildDatabaseFieldsSchema(),
    ...builders.buildSecurityFieldsSchema(),
    ...builders.buildCorsFieldsSchema(),
    ...builders.buildAppFieldsSchema(),
  });

  return baseSchema.unknown(envConfig.allowUnknown).messages({
    'object.unknown': envConfig.message,
  });
}

export const configValidationSchema = buildConfigSchema();
