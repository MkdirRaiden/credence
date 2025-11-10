// src/logger/helpers/output/write-log.helper.ts
import { formatLogJson, logWriter, sanitizeLog } from '@/logger/helpers';
import { LogLevel, shouldLog, LogContext } from '@/common/interfaces';

export function writeLog(
  level: LogLevel,
  minLevel: LogLevel,
  message: unknown,
  env?: string,
  context?: LogContext,
  error?: string | Error,
): void {
  if (!shouldLog(level, minLevel)) return;

  const safeMsg =
    typeof message === 'object' && message !== null
      ? sanitizeLog(message)
      : message;

  const json = formatLogJson(level, safeMsg, {
    context,
    env,
    ...(error && { error }),
  });

  logWriter(level, json);
}
