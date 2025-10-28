// src/health/health.scheduler.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';
import { HEALTH_CHECK_INTERVAL_MS } from '@/common/constants';
import { PrismaProbe } from '@/health/probes/prisma.probe';

@Injectable()
export class HealthScheduler implements OnApplicationShutdown {
  // Timer for health checks
  private interval?: NodeJS.Timeout;

  constructor(
    private readonly logger: LoggerService,
    private readonly prismaProbe: PrismaProbe,
  ) {}

  public start(intervalMs = HEALTH_CHECK_INTERVAL_MS) {
    if (this.interval) return;
    this.interval = setInterval(() => {
      void this.tick();
    }, intervalMs);
  }

  private async tick() {
    const db = await this.prismaProbe.check();
    if (db.status !== 'up') {
      this.logger.warn(
        `Periodic health check failed: ${JSON.stringify({ database: db })}`,
        'HealthScheduler',
      );
    }
  }

  onApplicationShutdown(signal?: string) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
      this.logger.log(
        `HealthScheduler stopped. Signal: ${signal}`,
        'HealthScheduler',
      );
    }
  }
}
