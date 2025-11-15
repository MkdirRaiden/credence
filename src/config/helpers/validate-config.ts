// src/config/helpers/validate-config.ts
import { configValidationSchema, getCriticalSchema } from '@/config/schemas';
import { LOG_CONTEXTS } from '@/common/constants';
import { BootstrapLogger } from '@/logger/services';

/**
 * Pre-validates critical environment variables before DI initialization.
 * Throws on critical errors - let bootstrap error handler catch it.
 */
export async function validatePreConfig(
  logger: BootstrapLogger,
): Promise<void> {
  const criticalSchema = getCriticalSchema();
  await criticalSchema.validateAsync(process.env, { abortEarly: true });

  const { error } = configValidationSchema.validate(process.env, {
    abortEarly: false,
  });

  if (error) {
    const message = `Non-critical config issues: ${error.message}`;
    logger.warn(message, LOG_CONTEXTS.CONFIG);
  }
}
