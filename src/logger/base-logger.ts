// src/logger/base-logger.ts
import { LoggerService as NestLogger } from '@nestjs/common';
import { formatLogJson } from '@/logger/helpers/format-log-json';

export class BaseLogger implements NestLogger {
  constructor(protected readonly env?: string) {}

  log(message: any, context?: string) {
    console.log(
      formatLogJson('INFO', message, {
        context,
        env: this.env,
      }),
    );
  }

  error(message: any, traceOrError?: string | Error, context?: string) {
    console.error(
      formatLogJson('ERROR', message, {
        context,
        env: this.env,
        error: traceOrError,
      }),
    );
  }

  warn(message: any, context?: string) {
    console.warn(
      formatLogJson('WARN', message, {
        context,
        env: this.env,
      }),
    );
  }

  debug(message: any, context?: string) {
    if (this.env !== 'production') {
      console.debug(
        formatLogJson('DEBUG', message, {
          context,
          env: this.env,
        }),
      );
    }
  }

  verbose(message: any, context?: string) {
    if (this.env !== 'production') {
      console.debug(
        formatLogJson('VERBOSE', message, {
          context,
          env: this.env,
        }),
      );
    }
  }
}
