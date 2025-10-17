// src/health/health.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { buildResponse } from '@/common/utils/response-builder';
import { DatabaseProbe } from '@/health/probes/database.probe';
import { HealthScheduler } from '@/health/health.scheduler';
import { getLiveness, getReadiness } from '@/health/helpers';

@Injectable()
export class HealthService {
  constructor(
    private readonly dbProbe: DatabaseProbe,
    private readonly scheduler: HealthScheduler,
  ) {
    // Start periodic background checks (logs only on failure inside scheduler)
    this.scheduler.start();
  }

  // Public: controller uses this for /health/live
  liveEnvelope() {
    const data = getLiveness();
    return buildResponse(data, '/health/live', HttpStatus.OK, true, 'Liveness OK');
  }

  // Public: controller uses this for /health/ready
  async readyEnvelopeOrThrow() {
    const readiness = await getReadiness(this.dbProbe);
    if (readiness.status === 'error') {
      throw new HttpException(readiness, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return buildResponse(readiness, '/health/ready', HttpStatus.OK, true, 'Readiness OK');
  }

  // Public: bootstrap helper uses this before listen()
  async assertReadiness(): Promise<void> {
    const readiness = await getReadiness(this.dbProbe);
    if (readiness.status !== 'ok') {
      throw new Error(`Readiness failed: ${JSON.stringify(readiness.details)}`);
    }
  }
}