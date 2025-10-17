// src/logger/base-logger.ts
import { LoggerService as NestLogger } from '@nestjs/common';
import { formatLogJson } from '@/logger/helpers';
import { MetaFn } from '@/logger/logger.interface';

export class BaseLogger implements NestLogger {
  constructor(
    protected readonly env?: string,
    protected readonly getMeta?: MetaFn, // e.g., returns { requestId } from ALS
  ) {}

  protected meta() { return this.getMeta ? this.getMeta() : undefined; }

  log(message: any, context?: string) {
    console.log(formatLogJson('INFO', message, { context, env: this.env, meta: this.meta() }));
  }

  error(message: any, traceOrError?: string | Error, context?: string) {
    console.error(
      formatLogJson('ERROR', message, {
        context,
        env: this.env,
        error: traceOrError,
        meta: this.meta(),
      }),
    );
  }

  warn(message: any, context?: string) {
    console.warn(formatLogJson('WARN', message, { context, env: this.env, meta: this.meta() }));
  }

  debug(message: any, context?: string) {
    if (!this.env || this.env !== 'production') {
      console.debug(formatLogJson('DEBUG', message, { context, env: this.env, meta: this.meta() }));
    }
  }

  verbose(message: any, context?: string) {
    if (!this.env || this.env !== 'production') {
      console.debug(
        formatLogJson('VERBOSE', message, { context, env: this.env, meta: this.meta() }),
      );
    }
  }
}