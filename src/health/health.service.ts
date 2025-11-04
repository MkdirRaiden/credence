// src/health/health.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { Probe } from '@/health/health.interface';
import { HealthScheduler } from '@/health/health.scheduler';
import { PROBES_TOKEN, PROBE_CHECK_TIMEOUT_MS } from '@/common/constants';
import {
  getLiveness,
  getReadiness,
  createTimeoutPromise,
} from '@/health/helpers';

/**
 * Orchestrates health checks across all probes.
 * Bootstrap phase runs assertReadiness() to gate traffic.
 * Ongoing health checks via scheduler + periodic probing.
 */
@Injectable()
export class HealthService implements OnModuleInit {
  constructor(
    @Inject(PROBES_TOKEN) private readonly probes: Probe[],
    private readonly scheduler: HealthScheduler,
  ) {}

  onModuleInit() {
    this.scheduler.start(this.probes);
  }

  liveness() {
    return getLiveness();
  }

  async readinessOrThrow() {
    const readiness = await this.executeReadinessCheck();

    if (readiness.status === 'error') {
      throw new HttpException(
        {
          status: readiness.status,
          details: readiness.details,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    return readiness;
  }

  async assertReadiness(): Promise<void> {
    const readiness = await this.executeReadinessCheck();

    if (readiness.status !== 'ok') {
      throw new Error(
        `Readiness check failed: ${JSON.stringify(readiness.details)}`,
      );
    }
  }

  private async executeReadinessCheck() {
    const probeTimeoutMs = Math.floor(PROBE_CHECK_TIMEOUT_MS * 0.8);
    const serviceTimeoutHandle = createTimeoutPromise(PROBE_CHECK_TIMEOUT_MS);

    try {
      return await Promise.race([
        getReadiness(this.probes, { timeout: probeTimeoutMs }),
        serviceTimeoutHandle.promise,
      ]);
    } finally {
      clearTimeout(serviceTimeoutHandle.id);
    }
  }
}
