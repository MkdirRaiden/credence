// src/health/health.controller.ts
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // Liveness endpoint: app running
  @Get('live')
  live() {
    return this.healthService.checkLiveness();
  }

  // Readiness endpoint: dependencies ready
  @Get('ready')
  async ready() {
    const readiness = await this.healthService.checkReadiness();

    if (readiness.status === 'error') {
      // Return proper HTTP 503 for monitoring / k8s readiness
      throw new HttpException(readiness, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return readiness;
  }

  // Legacy /health endpoint (optional)
  @Get()
  async health() {
    return this.ready(); // alias for readiness
  }
}
