// src/health/helpers/get-readiness.ts
import * as interfaces from '@/health/health.interface';

export async function getReadiness(
  probes: interfaces.Probe[],
  options?: { timeout?: number },
): Promise<interfaces.ReadinessStatus> {
  const results = await Promise.all(probes.map((p) => p.check(options)));

  const details: Record<string, interfaces.DependencyStatus> = {};
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
function mapProbeResult(
  result: interfaces.ProbeResult,
): interfaces.DependencyStatus {
  return result.status === 'up'
    ? { status: 'up' }
    : { status: 'down', message: result.message };
}
