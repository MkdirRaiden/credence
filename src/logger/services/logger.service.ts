// src/logger/services/logger.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseLogger } from '@/logger/base/base-logger';
import { AppConfig } from '@/common/interfaces';

/**
 * DI-backed logger service injected throughout the app after bootstrap.
 * Swaps BootstrapLogger after NestFactory.create() completes.
 */
@Injectable()
export class LoggerService extends BaseLogger {
  constructor(config: ConfigService<AppConfig, true>) {
    const env = config.get('nodeEnv', { infer: true });
    super(env);
  }
}
