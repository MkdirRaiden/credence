// src/health/helpers/get-readiness.ts
import type {
  ReadinessStatus,
  DependencyStatus,
  Probe, 
  ProbeResult
} from '@/health/health.interface';

/**
 * Checks all probes and returns aggregated readiness status.
 * Passes timeout to each probe to prevent hanging.
 * Returns 'ok' only if all probes are up.
 */
export async function getReadiness(
  probes: Probe[],
  options?: { timeout?: number },
): Promise<ReadinessStatus> {
  const results = await Promise.all(probes.map((p) => p.check(options)));

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
// Maps individual probe result to dependency status
function mapProbeResult(result: ProbeResult): DependencyStatus {
  return result.status === 'up'
    ? { status: 'up' }
    : { status: 'down', message: result.message };
}
