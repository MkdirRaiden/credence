// src/common/modules/common.module.ts
import { Module, Global } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as common from '@/common/modules/common.config';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@/common/interfaces';

@Global()
@Module({
  imports: [
      ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => [{
        ttl: config.get('throttle.ttl', { infer: true }),
        limit: config.get('throttle.limit', { infer: true }),
      }],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ...common.GLOBAL_INTERCEPTORS,
    ...common.GLOBAL_FILTERS,
  ],
})
export class CommonModule {}