// src/logger/bootstrap-logger.ts
import { BaseLogger } from '@/logger/base-logger';

export class BootstrapLogger extends BaseLogger {
  constructor() {
    super(process.env.NODE_ENV); // Pass the current environment
  }
}
