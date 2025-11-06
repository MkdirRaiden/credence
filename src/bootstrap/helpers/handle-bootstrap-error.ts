// src/bootstrap/helpers/handle-bootstrap-error.ts
import { INestApplication } from '@nestjs/common';
import { BootstrapLogger } from '@/logger/services';

const APP_CLOSE_TIMEOUT_MS = 5000; // 5 second graceful close timeout

/**
 * Centralized error handler for bootstrap phase.
 * Gracefully closes app with timeout, then exits.
 */
export async function handleBootstrapError(
  err: unknown,
  logger: BootstrapLogger,
  app: INestApplication | null,
): Promise<never> {
  const message = err instanceof Error ? err.message : String(err);

  logger.error(
    `Bootstrap failed: ${message}`,
    err instanceof Error ? err.stack : undefined,
    'Bootstrap',
  );

  // Graceful cleanup with timeout
  if (app) {
    try {
      await Promise.race([
        app.close(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('App close timeout')),
            APP_CLOSE_TIMEOUT_MS,
          ),
        ),
      ]);
      logger.log('App closed gracefully', 'Bootstrap');
    } catch (closeErr) {
      const closeMsg =
        closeErr instanceof Error ? closeErr.message : String(closeErr);
      logger.warn(`App close timeout/error: ${closeMsg}`, 'Bootstrap');
    }
  }

  process.exit(1);
}
