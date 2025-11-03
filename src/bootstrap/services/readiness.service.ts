// src/bootstrap/services/readiness.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';
import { runReadinessChecks } from '@/bootstrap/helpers';

/**
 * Runs critical readiness checks before accepting traffic.
 */
@Injectable()
export class ReadinessService {
  constructor(private readonly logger: LoggerService) {}

  async run(app: INestApplication): Promise<void> {
    this.logger.log('Running readiness checks...', 'Bootstrap.Readiness');
    await runReadinessChecks(app);
    this.logger.log('Readiness checks passed', 'Bootstrap.Readiness');
  }
}
