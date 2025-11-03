// src/logger/bootstrap-logger.ts
import { NODE_ENV } from '@/common/constants';
import { BaseLogger } from '@/logger/base-logger';

/**
 * Bootstrap logger for pre-DI initialization phase in main.ts.
 * Provides logging before NestFactory.create() completes.
 */
export class BootstrapLogger extends BaseLogger {
  constructor() {
    super(process.env.NODE_ENV || NODE_ENV);
  }
}
