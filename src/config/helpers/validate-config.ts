// src/config/helpers/validate-config.ts
import { configValidationSchema } from '@/config/config.schema';
import { BootstrapLogger } from '@/logger/bootstrap-logger';
import { getCriticalSchema } from '@/config/helpers/critical-schema';

const preBootLogger = new BootstrapLogger();

export function validatePreConfig() {
    const criticalSchema = getCriticalSchema();
    // Validate only CRITICAL vars first
    const { error: criticalError } = criticalSchema.validate(process.env, {
      abortEarly: true,
    });
    // Exit immediately if critical vars are missing/invalid
    if (criticalError) {
      const message = `Critical environment variables missing or invalid: ${criticalError.message}`;
      preBootLogger.error(message, undefined, 'ConfigPreValidation');
      process.exit(1); // immediate exit on critical config failure
    }
    // Validate ALL vars (non-critical included)
    const { error: fullError } = configValidationSchema.validate(process.env, {
      abortEarly: false,
    });
    // Log warnings for non-critical issues, but continue running
    if (fullError) {
      const message = `Non-critical config issues: ${fullError.message}`;
      preBootLogger.warn( message, 'ConfigPreValidation');
    }
}