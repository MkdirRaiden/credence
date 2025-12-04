// src/health/health.controller.ts
import { Controller, Get, HttpCode } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { HealthService } from '@/health/services';
import { LivenessDto, ReadinessDto } from '@/health/dtos';
import { SkipThrottle } from '@nestjs/throttler';

@swagger.ApiTags('health')
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @HttpCode(200)
  @swagger.ApiOkResponse({
    type: LivenessDto,
    description: 'Liveness status of the service',
  })
  live(): LivenessDto {
    return this.healthService.liveness();
  }

  @Get('ready')
  @HttpCode(200)
  @swagger.ApiOkResponse({
    type: ReadinessDto,
    description: 'Readiness status of the service and its dependencies',
  })
  @swagger.ApiServiceUnavailableResponse({
    description: 'One or more dependencies are unhealthy',
  })
  async ready(): Promise<ReadinessDto> {
    return this.healthService.readinessOrThrow();
  }
}
