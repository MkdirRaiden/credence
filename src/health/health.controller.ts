// src/health/health.controller.ts
import {
  ApiOkResponse,
  ApiTags,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { Controller, Get, HttpCode } from '@nestjs/common';
import { HealthService } from '@/health/services';
import { LivenessDto, ReadinessDto } from '@/health/dtos';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
@SkipThrottle()
@ApiTags('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @HttpCode(200)
  @ApiOkResponse({
    type: LivenessDto,
    description: 'Liveness status of the service',
  })
  live(): LivenessDto {
    return this.healthService.liveness();
  }

  @Get('ready')
  @HttpCode(200)
  @ApiOkResponse({
    type: ReadinessDto,
    description: 'Readiness status of the service and its dependencies',
  })
  @ApiServiceUnavailableResponse({
    description: 'One or more dependencies are unhealthy',
  })
  async ready(): Promise<ReadinessDto> {
    return this.healthService.readinessOrThrow();
  }
}
