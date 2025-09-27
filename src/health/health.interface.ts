// src/health/health.interface.ts
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
  details: {
    database: DependencyStatus;
  };
}
