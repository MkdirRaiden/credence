// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseLogger } from '@/logger/base-logger';
import { AppConfig } from '@/common/interfaces/app-config.interface';

@Injectable()
export class LoggerService extends BaseLogger {
  constructor(private readonly config: ConfigService<AppConfig>) {
    // Resolve env once; optionally pass a meta provider if you add ALS later
    const env = config.get('nodeEnv');
    super(env, undefined);
  }
}
