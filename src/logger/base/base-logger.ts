// src/logger/base/base-logger.ts
import { LoggerService as NestLogger } from '@nestjs/common';
import { formatLogJson, logWriter, sanitizeLog } from '@/logger/helpers';
import { LogLevel, shouldLog, LogContext } from '@/common/interfaces';
import { LOG_LEVEL } from '@/logger/constants';

export class BaseLogger implements NestLogger {
  constructor(
    protected readonly env?: string,
    protected readonly minLevel: LogLevel = LOG_LEVEL,
  ) {}

  log(message: unknown, context?: LogContext): void {
    if (!shouldLog('INFO', this.minLevel)) return;
    const safeMsg =
      typeof message === 'object' && message !== null
        ? sanitizeLog(message)
        : message;
    const json = formatLogJson('INFO', safeMsg, { context, env: this.env });
    logWriter('INFO', json);
  }

  error(
    message: unknown,
    traceOrError?: string | Error,
    context?: LogContext,
  ): void {
    if (!shouldLog('ERROR', this.minLevel)) return;
    const safeMsg =
      typeof message === 'object' && message !== null
        ? sanitizeLog(message)
        : message;
    const json = formatLogJson('ERROR', safeMsg, {
      context,
      env: this.env,
      error: traceOrError,
    });
    logWriter('ERROR', json);
  }

  warn(message: unknown, context?: LogContext): void {
    if (!shouldLog('WARN', this.minLevel)) return;
    const safeMsg =
      typeof message === 'object' && message !== null
        ? sanitizeLog(message)
        : message;
    const json = formatLogJson('WARN', safeMsg, { context, env: this.env });
    logWriter('WARN', json);
  }

  debug(message: unknown, context?: LogContext): void {
    if (!shouldLog('DEBUG', this.minLevel)) return;
    const safeMsg =
      typeof message === 'object' && message !== null
        ? sanitizeLog(message)
        : message;
    const json = formatLogJson('DEBUG', safeMsg, { context, env: this.env });
    logWriter('DEBUG', json);
  }

  verbose(message: unknown, context?: LogContext): void {
    if (!shouldLog('VERBOSE', this.minLevel)) return;
    const safeMsg =
      typeof message === 'object' && message !== null
        ? sanitizeLog(message)
        : message;
    const json = formatLogJson('VERBOSE', safeMsg, { context, env: this.env });
    logWriter('VERBOSE', json);
  }
}
