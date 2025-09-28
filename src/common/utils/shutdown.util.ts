import { LoggerService } from '../../logger/logger.service';
import { formatMessage } from './logger.util';

/**
 * Logs a critical failure and exits the process.
 * - Pre-bootstrap: exits immediately (no logger)
 * - Runtime: gives a short delay to flush logs
 */
export function gracefulShutdown(logger?: LoggerService, message?: string, delayMs = 200) {
  const logMsg = message || 'Critical shutdown';

  if (logger?.error) {
    logger.error(logMsg, undefined, 'Shutdown');
    setTimeout(() => process.exit(1), delayMs); // runtime → allow logs to flush
  } else {
    // pre-bootstrap → exit immediately
    console.error(JSON.stringify(formatMessage('ERROR', logMsg, 'Shutdown')));
    process.exit(1);
  }
}
