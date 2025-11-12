// src/bootstrap/bootstrap.module.ts
import { Module } from '@nestjs/common';
import * as services from '@/bootstrap/services/internals';
import { BootstrapService } from '@/bootstrap/services';
import { HealthModule } from '@/health/health.module';

/**
 * Provides initialization and startup services for NestJS application bootstrap.
 */
@Module({
  imports: [HealthModule],
  providers: [
    BootstrapService,
    services.MiddlewareSetupService,
    services.GlobalSetupService,
    services.ServerService,
    services.ReadinessService,
    services.ShutdownService,
  ],
  exports: [BootstrapService],
})
export class BootstrapModule {}
