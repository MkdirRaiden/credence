// src/config/helpers/validate-config.ts
import { configValidationSchema, getCriticalSchema } from '@/config/schemas';
import { BootstrapLogger } from '@/logger/services';

/**
 * Pre-validates critical environment variables before DI initialization.
 * Throws on critical errors - let bootstrap error handler catch it.
 */
export async function validatePreConfig(
  logger: BootstrapLogger,
): Promise<void> {
  // Critical phase - throws on error
  await getCriticalSchema().validateAsync(process.env, {
    abortEarly: true,
  });

  // Full phase - warn on non-critical issues
  const { error } = configValidationSchema.validate(process.env, {
    abortEarly: false,
  });

  if (error) {
    logger.warn(
      `Non-critical config issues: ${error.message}`,
      'ConfigPreValidation',
    );
  }
}
