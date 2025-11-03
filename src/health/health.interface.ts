// src/health/health.interface.ts
export interface Probe {
  readonly name: string;
  check(options?: { timeout?: number }): Promise<ProbeResult>;
}

export interface ProbeResult {
  name: string;
  status: 'up' | 'down';
  message?: string;
}

export interface DependencyStatus {
  status: 'up' | 'down';
  message?: string;
}

export interface LivenessStatus {
  status: 'up';
  uptimeMs?: number;
}

export interface ReadinessStatus {
  status: 'ok' | 'error';
  details: Record<string, DependencyStatus>;
}
