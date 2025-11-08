// src/health/services/scheduler.service.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { Probe } from '@/health/health.interface';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces';
import { LOG_CONTEXTS } from '@/logger/constants';

/**
 * Runs periodic health checks on all probes.
 * Logs failures but doesn't affect service availability.
 */
@Injectable()
export class SchedulerService implements OnApplicationShutdown {
  private interval?: NodeJS.Timeout;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  public start(probes: Probe[]) {
    const { healthCheckIntervalMs } = this.getDatabaseParams();
    if (this.interval) return;
    this.interval = setInterval(() => {
      void this.tick(probes);
    }, healthCheckIntervalMs);
  }

  private async tick(probes: Probe[]) {
    // Use probe timeout to prevent hanging
    const { probeCheckTimeoutMs } = this.getDatabaseParams();
    const probeTimeoutMs = Math.floor(probeCheckTimeoutMs * 0.6); // 60% for scheduler

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

  private getDatabaseParams(): AppConfig['database'] {
    return this.config.get('database', { infer: true });
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
