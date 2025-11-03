// src/health/helpers/index.ts
import type {
  ReadinessStatus,
  DependencyStatus,
} from '@/health/health.interface';
import type { Probe, ProbeResult } from '@/health/health.interface';

export async function getReadiness(probes: Probe[]): Promise<ReadinessStatus> {
  const results = await Promise.all(probes.map((p) => p.check()));

  const details: Record<string, DependencyStatus> = {};
  let hasError = false;

  for (const result of results) {
    details[result.name] = mapProbeResult(result);
    if (result.status === 'down') {
      hasError = true;
    }
  }

  return {
    status: hasError ? 'error' : 'ok',
    details,
  };
}

export function getLiveness() {
  return { status: 'up' as const, uptimeMs: process.uptime() * 1000 };
}

function mapProbeResult(result: ProbeResult): DependencyStatus {
  return result.status === 'up'
    ? { status: 'up' }
    : { status: 'down', message: result.message };
}
