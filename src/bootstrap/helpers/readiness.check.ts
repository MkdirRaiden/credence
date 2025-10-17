// src/bootstrap/helpers/readiness.check.ts
import { INestApplication } from '@nestjs/common';
import { HealthService } from '@/health/health.service';

export async function runReadinessChecks(app: INestApplication) {
  const health = app.get(HealthService, { strict: false });

  if (!health || typeof (health as any).assertReadiness !== 'function') {
    // Fail fast with a clear message; adjust to warn-and-continue if desired
    throw new Error('Readiness check unavailable: HealthService.assertReadiness not found');
  }

  await health.assertReadiness();

  // Future: add more probes here (cache, queue, external APIs) and aggregate failures
  // Example:
  // await Promise.all([health.assertReadiness(), cache.assertReady(), queue.assertReady()]);
}
