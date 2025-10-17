// src/common/utils/shutdown-database.ts
import { LoggerService } from '@/logger/logger.service';
import { SHUTDOWN_TIMEOUT_MS } from '@/common/constants';

export function gracefulShutdown(
  logger: LoggerService,
  message?: string,
  delayMs = SHUTDOWN_TIMEOUT_MS,
) {
  const logMsg = message || 'Critical shutdown';

  logger.error(logMsg, undefined, 'Shutdown');

  // always runtime-style shutdown → give time for logs to flush
  setTimeout(() => process.exit(1), delayMs);
}
