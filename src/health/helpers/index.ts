// src/health/helpers/index.ts
import type {
  ReadinessStatus,
  DependencyStatus,
} from '@/health/health.interface';
import type { PrismaProbe } from '@/health/probes/prisma.probe';

export async function getReadiness(
  prismaProbe: PrismaProbe,
): Promise<ReadinessStatus> {
  const db = await prismaProbe.check();
  const status: ReadinessStatus['status'] = db.status === 'up' ? 'ok' : 'error';
  return {
    status,
    details: { database: mapProbe(db) },
  };
}

export function getLiveness() {
  return { status: 'up' as const, uptimeMs: process.uptime() * 1000 };
}

function mapProbe(p: {
  status: 'up' | 'down';
  message?: string;
}): DependencyStatus {
  return p.status === 'up'
    ? { status: 'up' }
    : { status: 'down', message: p.message };
}
