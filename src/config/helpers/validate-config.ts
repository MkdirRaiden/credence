// src/config/helpers/validate-config.ts
import { configValidationSchema } from '@/config/config.schema';
import { BootstrapLogger } from '@/logger/bootstrap-logger';
import { getCriticalSchema } from '@/config/helpers/critical-schema';

export function validatePreConfig(logger?: BootstrapLogger) {
  const preBootLogger = logger || new BootstrapLogger();

  const criticalSchema = getCriticalSchema();
  const { error: criticalError } = criticalSchema.validate(process.env, {
    abortEarly: true,
  });

  if (criticalError) {
    const message = `Critical environment variables missing or invalid: ${criticalError.message}`;
    preBootLogger.error(message, undefined, 'ConfigPreValidation');
    process.exit(1);
  }

  const { error: fullError } = configValidationSchema.validate(process.env, {
    abortEarly: false,
  });

  if (fullError) {
    const message = `Non-critical config issues: ${fullError.message}`;
    preBootLogger.warn(message, 'ConfigPreValidation');
  }
}