// src/bootstrap/bootstrap.module.ts
import { Module } from '@nestjs/common';
import {
  BootstrapService,
  MiddlewareSetupService,
  GlobalSetupService,
  ServerService,
  ReadinessService,
  ShutdownService,
} from '@/bootstrap/services';
import { HealthModule } from '@/health/health.module';

/**
 * Provides initialization and startup services for NestJS application bootstrap.
 */
@Module({
  imports: [HealthModule],
  providers: [
    BootstrapService,
    MiddlewareSetupService,
    GlobalSetupService,
    ServerService,
    ReadinessService,
    ShutdownService,
  ],
  exports: [BootstrapService],
})
export class BootstrapModule {}
