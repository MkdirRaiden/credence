// src/bootstrap/helpers/handle-bootstrap-error.ts
import { BootstrapLogger } from '@/logger/bootstrap-logger';

/**
 * Handles bootstrap errors with proper type safety and logging
 */
export function handleBootstrapError(
  err: unknown,
  logger: BootstrapLogger,
): never {
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorStack = err instanceof Error ? err.stack : undefined;
  const message = `Bootstrap failed, err: ${errorMessage}`;
  logger.error(message, errorStack, 'Bootstrap.error');
  process.exit(1);
}
