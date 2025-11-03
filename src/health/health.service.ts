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
import { PROBES_TOKEN } from '@/common/constants';
import { getLiveness, getReadiness } from '@/health/helpers';

/**
 * Orchestrates health checks across all probes.
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
    const readiness = await getReadiness(this.probes);
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
    const readiness = await getReadiness(this.probes);
    if (readiness.status !== 'ok') {
      throw new Error(
        `Readiness check failed: ${JSON.stringify(readiness.details)}`,
      );
    }
  }
}
