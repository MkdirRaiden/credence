// src/health/contracts/base-health.service.ts

export abstract class BaseHealthService {
  abstract assertReadiness(): Promise<void>;
}
