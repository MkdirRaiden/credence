// src/health/health.module.ts
import { Module } from '@nestjs/common';
import { HealthController } from '@/health/health.controller';
import { HealthService } from '@/health/health.service';
import { HealthScheduler } from '@/health/health.scheduler';
import { PrismaProbe } from '@/health/probes/prisma.probe';

@Module({
  controllers: [HealthController],
  providers: [HealthService, HealthScheduler, PrismaProbe],
  exports: [HealthService],
})
export class HealthModule {}
