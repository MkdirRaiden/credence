import { Module } from '@nestjs/common';
import { HealthController } from '@/health/health.controller';
import { HealthService } from '@/health/health.service';
import { HealthScheduler } from '@/health/health.scheduler';
import { DatabaseProbe } from '@/health/probes/database.probe';

@Module({
  controllers: [HealthController],
  providers: [HealthService, HealthScheduler, DatabaseProbe],
  exports: [HealthService],
})
export class HealthModule {}
