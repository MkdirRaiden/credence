// src/bootstrap/bootstrap.module.ts
import { Module } from '@nestjs/common';
import { BootstrapService } from '@/bootstrap/bootstrap.service';
import {
  MiddlewareSetupService,
  GlobalSetupService,
  ServerService,
  ReadinessService,
  ShutdownService,
} from '@/bootstrap/services';

/**
 * Provides initialization and startup services for NestJS application bootstrap.
 */
@Module({
  providers: [
    BootstrapService,
    MiddlewareSetupService,
    GlobalSetupService,
    ServerService,
    ReadinessService,
    ShutdownService,
  ],
  exports: [BootstrapService, ShutdownService],
})
export class BootstrapModule {}