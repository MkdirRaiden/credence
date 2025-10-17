// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseLogger } from '@/logger/base-logger';
import { NODE_ENV } from '@/common/constants';

@Injectable()
export class LoggerService extends BaseLogger {
  constructor(private readonly config: ConfigService) {
    // Resolve env once; optionally pass a meta provider if you add ALS later
    const env = config.get<string>('nodeEnv', NODE_ENV);
    super(env, undefined);
  }
}