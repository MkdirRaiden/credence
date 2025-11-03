// src/health/health.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from '@/health/health.controller';
import { HealthService } from '@/health/health.service';
import { HealthScheduler } from '@/health/health.scheduler';
import { PrismaProbe } from '@/health/probes/prisma.probe';
import { PROBES_TOKEN } from '@/common/constants';

/**
 * Health check module with extensible probe architecture.
 */
@Module({
  controllers: [HealthController],
  providers: [
    HealthService,
    HealthScheduler,
    PrismaProbe,
    {
      provide: PROBES_TOKEN,
      useFactory: (prismaProbe: PrismaProbe) => [
        prismaProbe,
        // Add more probes here: redisProbe, mongoProbe, etc.
      ],
      inject: [PrismaProbe],
    },
  ],
  exports: [HealthService],
})
export class HealthModule {}
