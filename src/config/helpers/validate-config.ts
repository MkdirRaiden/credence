// src/config/helpers/validate-config.ts
import { configValidationSchema, getCriticalSchema } from '@/config/schemas';
import { BootstrapLogger } from '@/logger/services';

/**
 * Pre-validates critical environment variables before DI initialization.
 * Fails fast on missing/invalid vars; warns on non-critical issues.
 */
export function validatePreConfig(logger?: BootstrapLogger) {
  const preBootLogger = logger || new BootstrapLogger();

  // Critical phase: database, jwt secrets must exist
  const criticalSchema = getCriticalSchema();
  const { error: criticalError } = criticalSchema.validate(process.env, {
    abortEarly: true,
  });

  if (criticalError) {
    const message = `Critical environment variables missing or invalid: ${criticalError.message}`;
    preBootLogger.error(message, undefined, 'ConfigPreValidation');
    process.exit(1);
  }

  // Full phase: validate all vars, warn on non-critical issues
  const { error: fullError } = configValidationSchema.validate(process.env, {
    abortEarly: false,
  });

  if (fullError) {
    const message = `Non-critical config issues: ${fullError.message}`;
    preBootLogger.warn(message, 'ConfigPreValidation');
  }
}
