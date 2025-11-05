// src/bootstrap/helpers/handle-bootstrap-error.ts
import { INestApplication } from '@nestjs/common';
import { BootstrapLogger } from '@/logger/services';

/**
 * Centralized bootstrap error handler with graceful cleanup and process exit.
 */
export async function handleBootstrapError(
  err: unknown,
  logger: BootstrapLogger,
  app: INestApplication | null,
): Promise<never> {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error(`Bootstrap failed: ${message}`, stack, 'Bootstrap');

  // Graceful cleanup if app was created
  if (app) {
    try {
      await app.close();
      logger.log('App closed gracefully', 'Bootstrap');
    } catch (closeErr) {    
      const closeMessage = 
      closeErr instanceof Error ? closeErr.message : String(closeErr);
      logger.error(
        `Error closing app: ${closeMessage}`,
        undefined,
        'Bootstrap',
      );
    }
  }
  
  process.exit(1);
}
