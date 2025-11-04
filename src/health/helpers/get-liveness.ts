// src/health/helpers/get-liveness.ts
/**
 * Returns liveness status with uptime in milliseconds.
 * Used for Kubernetes liveness probes.
 */
export function getLiveness() {
  return { status: 'up' as const, uptimeMs: process.uptime() * 1000 };
}
