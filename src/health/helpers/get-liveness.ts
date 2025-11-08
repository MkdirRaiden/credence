// src/health/helpers/get-liveness.ts

export function getLiveness() {
  return { status: 'up' as const, uptimeMs: process.uptime() * 1000 };
}
