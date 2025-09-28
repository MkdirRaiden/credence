// src/config/config.helper.ts
import * as path from 'path';
import * as fs from 'fs';
import { DEFAULT_ENV } from 'src/common/constants';
import { configValidationSchema } from './config.schema';
import { gracefulShutdown } from '../common/utils/shutdown.util';

export class ConfigHelper {
  // Return the main and optional local env files that exist
  static getEnvFilePaths(): string[] {
    const env = process.env.NODE_ENV || DEFAULT_ENV;
    const mainFile = path.resolve(process.cwd(), `env/.env.${env}`);
    const localFile = path.resolve(process.cwd(), `env/.env.local`);
    return [mainFile, localFile].filter((file) => fs.existsSync(file));
  }

  // Validate critical environment variables before app bootstrap
  static validatePreConfig() {
    // Pick only the critical vars from the existing schema
    const preSchema = configValidationSchema
      .fork(['NODE_ENV', 'DATABASE_URL'], (s) => s.required())
      .unknown(); // allow extra vars

    const { error, value } = preSchema.validate(process.env, { abortEarly: true });

    if (error) {
      const message = `Critical environment variables missing or invalid: ${error.message}`;
      gracefulShutdown(undefined, message, 0);
    }

    return value;
  }
}
