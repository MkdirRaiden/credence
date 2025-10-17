// src/logger/logger.bootstrap.ts
import { BaseLogger } from '@/logger/logger.base';

export class BootstrapLogger extends BaseLogger {
  constructor() {
    super(undefined, undefined); // no env, no meta during bootstrap
  }
}
