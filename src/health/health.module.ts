// src/health/health.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from '@/health/health.controller';
import { SchedulerService, PrismaProbeService, HealthService } from '@/health/services';
import { PROBES_TOKEN } from '@/common/constants';
import { BaseHealthService } from '@/health/contracts/base-health.service';

/**
 * Health check module with extensible probe architecture.
 */
@Module({
  controllers: [HealthController],
  providers: [
    HealthService,
    SchedulerService,
    PrismaProbeService,
    {
      provide: BaseHealthService,
      useClass: HealthService
    },
    {
      provide: PROBES_TOKEN,
      useFactory: (prismaProbe: PrismaProbeService) => [
        prismaProbe,
        // Add more probes here: redisProbe, mongoProbe, etc.
      ],
      inject: [PrismaProbeService],
    },
  ],
  exports: [BaseHealthService],
})
export class HealthModule {}
