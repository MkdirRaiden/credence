// src/bootstrap/services/readiness.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { BaseHealthService } from '@/health/contracts';

/**
 * Runs critical readiness checks before accepting traffic.
 */
@Injectable()
export class ReadinessService {
  constructor(
    @Inject(BaseHealthService) private readonly health: BaseHealthService,
    private readonly logger: LoggerService,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Running readiness checks...', 'Bootstrap.Readiness');
    await this.health.assertReadiness();
    this.logger.log('Readiness checks passed', 'Bootstrap.Readiness');
  }
}
