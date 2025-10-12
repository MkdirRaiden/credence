// src/config/config.helper.ts
import Joi from 'joi';
import * as path from 'path';
import * as fs from 'fs';
import { NODE_ENV, CRITICAL_ENV_VARS } from '@/common/constants';
import { configValidationSchema } from '@/config/config.schema';
import { BootstrapLogger } from '@/logger/bootstrap-logger';

export class ConfigHelper {

  // Create a pre-schema with only the critical vars marked as required
  private static getCriticalSchema(): Joi.ObjectSchema {
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

  // Return the main and optional local env files that exist
  static getEnvFilePaths(): string[] {
    const env = process.env.NODE_ENV || NODE_ENV;
    const mainFile = path.resolve(process.cwd(), `env/.env.${env}`);
    return fs.existsSync(mainFile) ? [mainFile] : [];
  }

  // Validate environment variables before app bootstrap
  static validatePreConfig() {
    // Validate only CRITICAL vars first
    const criticalSchema = this.getCriticalSchema();
    const { error: criticalError } = criticalSchema.validate(process.env, {
      abortEarly: true,
    });
    if (criticalError) {
      BootstrapLogger.error(
        `Critical environment variables missing or invalid: ${criticalError.message}`,
        undefined,
        'ConfigHelper',
      );
      process.exit(1); // immediate exit on critical config failure
    }
    // Validate ALL vars (non-critical included)
    const { error: fullError } = configValidationSchema.validate(process.env, {
      abortEarly: false,
    });
    if (fullError) {
      BootstrapLogger.warn(
        `Non-critical config issues: ${fullError.message}`,
        'ConfigHelper',
      );
    }
  }
}
