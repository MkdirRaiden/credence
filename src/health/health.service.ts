// src/health/health.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
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

  // Returns liveness data 
  liveness() {
    return getLiveness();
  }

  // Returns readiness data or throws if unhealthy
  async readinessOrThrow() {
    const readiness = await getReadiness(this.prismaProbe);
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

  // Assert readiness for bootstrap checks (no HTTP response)
  async assertReadiness(): Promise<void> {
    const readiness = await getReadiness(this.prismaProbe);
    if (readiness.status !== 'ok') {
      throw new Error(
        `Readiness check failed: ${JSON.stringify(readiness.details)}`,
      );
    }
  }
}
