// src/logger/services/bootstrap-logger.ts
import { NODE_ENV } from '@/config/constants';
import { BaseLogger } from '@/logger/base/base-logger';

/**
 * Bootstrap logger for pre-DI initialization phase in main.ts.
 * Provides logging before NestFactory.create() completes.
 */
export class BootstrapLogger extends BaseLogger {
  constructor() {
    super(NODE_ENV);
  }
}
