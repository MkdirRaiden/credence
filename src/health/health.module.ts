// src/health/health.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from '@/health/health.controller';
import * as services from '@/health/services';
import { PROBES_TOKEN } from '@/health/symbols';
import * as contracts from '@/health/contracts';

/**
 * Health check module with extensible probe architecture.
 */
@Module({
  controllers: [HealthController],
  providers: [
    services.HealthService,
    services.SchedulerService,
    services.PrismaProbeService,
    {
      provide: contracts.BaseHealthService,
      useClass: services.HealthService,
    },
    {
      provide: PROBES_TOKEN,
      useFactory: (prismaProbe: services.PrismaProbeService) => [
        prismaProbe,
        // Add more probes here: redisProbe, mongoProbe, etc.
      ],
      inject: [services.PrismaProbeService],
    },
  ],
  exports: [contracts.BaseHealthService],
})
export class HealthModule {}
