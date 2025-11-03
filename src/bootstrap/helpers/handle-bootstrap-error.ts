// src/bootstrap/helpers/handle-bootstrap-error.ts
import { INestApplication } from '@nestjs/common';
import { BootstrapLogger } from '@/logger/bootstrap-logger';

/**
 * Centralized bootstrap error handler with graceful cleanup and process exit.
 */
export async function handleBootstrapError(
  err: unknown,
  logger: BootstrapLogger,
  app: INestApplication | null,
): Promise<never> {
  const errorMessage = err instanceof Error ? err.message : String(err);
  const errorStack = err instanceof Error ? err.stack : undefined;
  const context = (err as any)?.context; // Extract context from AppException
  const message = `Bootstrap failed: ${errorMessage}`;

  const contextStr = context ? JSON.stringify(context, null, 2) : undefined;
  logger.error(message, contextStr || errorStack, 'Bootstrap.error');

  // Graceful cleanup if app was created
  if (app) {
    try {
      await app.close();
      logger.log('App closed gracefully', 'Bootstrap.error');
    } catch (closeErr) {
      const closeMessage =
        closeErr instanceof Error ? closeErr.message : String(closeErr);
      logger.error('Error closing app', closeMessage, 'Bootstrap.error');
    }
  }

  process.exit(1);
}
