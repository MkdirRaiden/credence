// src/health/services/scheduler.service.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { Probe } from '@/health/health.interface';
import { LOG_CONTEXTS } from '@/common/constants';
import * as constants from '@/health/constants';

/**
 * Runs periodic health checks on all probes.
 * Logs failures but doesn't affect service availability.
 */
@Injectable()
export class SchedulerService implements OnApplicationShutdown {
  private interval?: NodeJS.Timeout;

  constructor(private readonly logger: LoggerService) {}

  public start(probes: Probe[]) {
    if (this.interval) return;
    this.interval = setInterval(() => {
      void this.tick(probes);
    }, constants.HEALTH_CHECK_INTERVAL_MS);
  }

  private async tick(probes: Probe[]) {
    // Use probe timeout to prevent hanging
    const probeTimeoutMs = Math.floor(constants.PROBE_CHECK_TIMEOUT_MS * 0.6);

    const results = await Promise.all(
      probes.map((p) =>
        p.check({ timeout: probeTimeoutMs }).catch((err) => ({
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
        LOG_CONTEXTS.HEALTH,
      );
    }
  }

  onApplicationShutdown(signal?: string) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
      this.logger.log(
        `HealthScheduler stopped. Signal: ${signal}`,
        LOG_CONTEXTS.HEALTH,
      );
    }
  }
}
