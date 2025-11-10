// src/logger/base/base-logger.ts
import { LoggerService as NestLogger } from '@nestjs/common';
import { writeLog } from '@/logger/helpers';
import { LogLevel, LogContext } from '@/common/interfaces';
import { LOG_LEVEL } from '@/logger/constants';

export class BaseLogger implements NestLogger {
  constructor(
    protected readonly env?: string,
    protected readonly minLevel: LogLevel = LOG_LEVEL,
  ) {}

  log(message: unknown, context?: LogContext): void {
    writeLog('INFO', this.minLevel, message, this.env, context);
  }

  error(
    message: unknown,
    traceOrError?: string | Error,
    context?: LogContext,
  ): void {
    writeLog('ERROR', this.minLevel, message, this.env, context, traceOrError);
  }

  warn(message: unknown, context?: LogContext): void {
    writeLog('WARN', this.minLevel, message, this.env, context);
  }

  debug(message: unknown, context?: LogContext): void {
    writeLog('DEBUG', this.minLevel, message, this.env, context);
  }

  verbose(message: unknown, context?: LogContext): void {
    writeLog('VERBOSE', this.minLevel, message, this.env, context);
  }
}
