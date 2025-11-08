// src/bootstrap/services/readiness.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { BaseHealthService } from '@/health/contracts';
import { LOG_CONTEXTS } from '@/logger/constants';

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
    this.logger.log('Running readiness checks...', LOG_CONTEXTS.BOOTSTRAP);
    await this.health.assertReadiness();
    this.logger.log('Readiness checks passed', LOG_CONTEXTS.BOOTSTRAP);
  }
}
