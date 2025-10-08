import Joi from 'joi';
import * as path from 'path';
import * as fs from 'fs';
import { DEFAULT_ENV, CRITICAL_ENV_VARS } from 'src/common/constants';
import { configValidationSchema } from './config.schema';
import { BootstrapLogger } from 'src/logger/bootstrap-logger';

export class ConfigHelper {
  // Return the main and optional local env files that exist
  static getEnvFilePaths(): string[] {
    const env = process.env.NODE_ENV || DEFAULT_ENV;
    const mainFile = path.resolve(process.cwd(), `env/.env.${env}`);
    const localFile = path.resolve(process.cwd(), `env/.env.local`);
    return [mainFile, localFile].filter((file) => fs.existsSync(file));
  }

  // Validate environment variables before app bootstrap
  static validatePreConfig() {
    // Create a pre-schema with only the critical vars marked as required
    const criticalSchema = Joi.object(
      Object.fromEntries(
        CRITICAL_ENV_VARS.map((key) => [
          key,
          configValidationSchema.extract(key).required(),
        ]),
      ),
    ).unknown();

    // Validate critical vars
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
