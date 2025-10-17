// src/logger/bootstrap-logger.ts
import { BaseLogger } from '@/logger/base-logger';

export class BootstrapLogger extends BaseLogger {
  constructor() {
    super(undefined, undefined); // no env, no meta during bootstrap
  }
}
