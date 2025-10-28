// src/health/health.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { buildResponse } from '@/common/utils/response-builder';
import { PrismaProbe } from '@/health/probes/prisma.probe';
import { HealthScheduler } from '@/health/health.scheduler';
import { getLiveness, getReadiness } from '@/health/helpers';

@Injectable()
export class HealthService implements OnModuleInit {
  constructor(
    private readonly prismaProbe: PrismaProbe,
    private readonly scheduler: HealthScheduler,
  ) {}

  onModuleInit() {
    this.scheduler.start();
  }

  liveEnvelope() {
    const data = getLiveness();
    return buildResponse(
      data,
      '/health/live',
      HttpStatus.OK,
      true,
      'Liveness OK',
    );
  }

  async readyEnvelopeOrThrow() {
    const readiness = await getReadiness(this.prismaProbe);
    if (readiness.status === 'error') {
      throw new HttpException(readiness, HttpStatus.SERVICE_UNAVAILABLE);
    }
    return buildResponse(
      readiness,
      '/health/ready',
      HttpStatus.OK,
      true,
      'Readiness OK',
    );
  }

  async assertReadiness(): Promise<void> {
    const readiness = await getReadiness(this.prismaProbe);
    if (readiness.status !== 'ok') {
      throw new Error(
        `Readiness check failed: ${JSON.stringify(readiness.details)}`,
      );
    }
  }
}
