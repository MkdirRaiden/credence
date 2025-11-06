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
import { PROBES_TOKEN } from '@/health/symbols';
import * as helpers from '@/health/helpers';
import { BaseHealthService } from '@/health/contracts';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@/common/interfaces';

/**
 * Orchestrates health checks across all probes.
 * Bootstrap phase runs assertReadiness() to gate traffic.
 * Ongoing health checks via scheduler + periodic probing.
 */
@Injectable()
export class HealthService extends BaseHealthService implements OnModuleInit {
  constructor(
    @Inject(PROBES_TOKEN) private readonly probes: Probe[],
    private readonly scheduler: SchedulerService,
    private readonly config: ConfigService<AppConfig, true>,
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
    const { probeCheckTimeoutMs } = this.config.get('database', {
      infer: true,
    });
    const probeTimeoutMs = Math.floor(probeCheckTimeoutMs * 0.8);
    const serviceTimeoutHandle =
      helpers.createTimeoutPromise(probeCheckTimeoutMs);

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
