// src/health/helpers/readiness.ts
import type {
  ReadinessStatus,
  DependencyStatus,
} from '@/health/health.interface';
import type { DatabaseProbe } from '@/health/probes/database.probe';

// Pure helper: aggregates probe results into a readiness domain object
export async function getReadiness(
  dbProbe: DatabaseProbe,
): Promise<ReadinessStatus> {
  const db = await dbProbe.check();
  const status: ReadinessStatus['status'] = db.status === 'up' ? 'ok' : 'error';
  return {
    status,
    details: { database: mapProbe(db) },
  };
}

// Pure helper: returns liveness domain data
export function getLiveness() {
  return { status: 'up' as const, uptimeMs: process.uptime() * 1000 };
}

// Internal mapping helper
function mapProbe(p: {
  status: 'up' | 'down';
  message?: string;
}): DependencyStatus {
  return p.status === 'up'
    ? { status: 'up' }
    : { status: 'down', message: p.message };
}
