// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseLogger } from '@/logger/base-logger';
import { AppConfig } from '@/common/interfaces/app-config.interface';

@Injectable()
export class LoggerService extends BaseLogger {
  constructor(config: ConfigService<AppConfig>) {
    const env = config.get('nodeEnv', { infer: true });
    super(env);
  }
}
