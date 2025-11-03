// src/health/health.scheduler.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';
import { HEALTH_CHECK_INTERVAL_MS } from '@/common/constants';
import { Probe } from '@/health/health.interface';

/**
 * Runs periodic health checks on all probes.
 */
@Injectable()
export class HealthScheduler implements OnApplicationShutdown {
  private interval?: NodeJS.Timeout;

  constructor(private readonly logger: LoggerService) {}

  public start(probes: Probe[], intervalMs = HEALTH_CHECK_INTERVAL_MS) {
    if (this.interval) return;
    this.interval = setInterval(() => {
      void this.tick(probes);
    }, intervalMs);
  }

  private async tick(probes: Probe[]) {
    const results = await Promise.all(
      probes.map((p) =>
        p.check().catch((err) => ({
          name: 'unknown',
          status: 'down' as const,
          message: err instanceof Error ? err.message : String(err),
        })),
      ),
    );

    const failures = results.filter((r) => r.status === 'down');

    if (failures.length > 0) {
      this.logger.warn(
        `Health check failures: ${JSON.stringify(failures)}`,
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
