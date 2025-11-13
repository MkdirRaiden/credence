// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthService } from '@/health/services';
import { SkipThrottle } from '@nestjs/throttler';

/**
 * Health check endpoints for Kubernetes probes.
 */
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  live() {
    return this.healthService.liveness();
  }

  @Get('ready')
  async ready() {
    return this.healthService.readinessOrThrow();
  }
}
