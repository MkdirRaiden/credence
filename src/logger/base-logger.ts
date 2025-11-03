// src/logger/base-logger.ts
import { LoggerService as NestLogger } from '@nestjs/common';
import { formatLogJson, logWriter } from '@/logger/helpers';

/**
 * Base logger implementing NestJS LoggerService interface.
 * Orchestrates logging flow: receive → format → output, delegating to helpers.
 */
export class BaseLogger implements NestLogger {
  constructor(protected readonly env?: string) {}

  log(message: any, context?: string) {
    const json = formatLogJson('INFO', message, {
      context,
      env: this.env,
    });
    logWriter('INFO', json);
  }

  error(message: any, traceOrError?: string | Error, context?: string) {
    const json = formatLogJson('ERROR', message, {
      context,
      env: this.env,
      error: traceOrError,
    });
    logWriter('ERROR', json);
  }

  warn(message: any, context?: string) {
    const json = formatLogJson('WARN', message, {
      context,
      env: this.env,
    });
    logWriter('WARN', json);
  }

  // Debug and verbose skipped in production to reduce noise
  debug(message: any, context?: string) {
    if (this.env !== 'production') {
      const json = formatLogJson('DEBUG', message, {
        context,
        env: this.env,
      });
      logWriter('DEBUG', json);
    }
  }

  verbose(message: any, context?: string) {
    if (this.env !== 'production') {
      const json = formatLogJson('VERBOSE', message, {
        context,
        env: this.env,
      });
      logWriter('VERBOSE', json);
    }
  }
}
