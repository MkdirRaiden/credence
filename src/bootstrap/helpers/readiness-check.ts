// src/bootstrap/helpers/readiness-check.ts
import { INestApplication } from '@nestjs/common';
import { HealthService } from '@/health/health.service';

export async function runReadinessChecks(app: INestApplication) {
  const health = app.get<HealthService>(HealthService, { strict: false });

  if (!health) {
    throw new Error('Readiness check unavailable: HealthService not found');
  }

  if (typeof health.assertReadiness !== 'function') {
    throw new Error(
      'Readiness check unavailable: HealthService.assertReadiness not found',
    );
  }

  await health.assertReadiness();
}
