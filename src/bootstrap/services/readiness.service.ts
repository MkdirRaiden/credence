// src/bootstrap/services/readiness.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';
import { HealthService } from '@/health/health.service';

/**
 * Runs critical readiness checks before accepting traffic.
 */
@Injectable()
export class ReadinessService {
  constructor(
    private readonly logger: LoggerService,
    private readonly health: HealthService,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Running readiness checks...', 'Bootstrap.Readiness');
    await this.health.assertReadiness();
    this.logger.log('Readiness checks passed', 'Bootstrap.Readiness');
  }
}
