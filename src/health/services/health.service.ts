// src/health/services/health.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  OnModuleInit,
  Inject,
} from '@nestjs/common';
import { Probe } from '@/health/health.interface';
import { SchedulerService } from '@/health/services';
import * as constants from '@/health/constants';
import * as helpers from '@/health/helpers';
import { BaseHealthService } from '@/health/contracts';

/**
 * Orchestrates health checks across all probes.
 * Bootstrap phase runs assertReadiness() to gate traffic.
 * Ongoing health checks via scheduler + periodic probing.
 */
@Injectable()
export class HealthService extends BaseHealthService implements OnModuleInit {
  constructor(
    @Inject(constants.PROBES_TOKEN) private readonly probes: Probe[],
    private readonly scheduler: SchedulerService,
  ) {
    super();
  }

  onModuleInit() {
    this.scheduler.start(this.probes);
  }

  liveness() {
    return helpers.getLiveness();
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

  // used for app readiness check
  async assertReadiness(): Promise<void> {
    const readiness = await this.executeReadinessCheck();

    if (readiness.status !== 'ok') {
      throw new Error(
        `Readiness check failed: ${JSON.stringify(readiness.details)}`,
      );
    }
  }

  private async executeReadinessCheck() {
    const probeTimeoutMs = Math.floor(constants.PROBE_CHECK_TIMEOUT_MS * 0.8);
    const serviceTimeoutHandle = helpers.createTimeoutPromise(
      constants.PROBE_CHECK_TIMEOUT_MS,
    );

    try {
      return await Promise.race([
        helpers.getReadiness(this.probes, { timeout: probeTimeoutMs }),
        serviceTimeoutHandle.promise,
      ]);
    } finally {
      clearTimeout(serviceTimeoutHandle.id);
    }
  }
}
