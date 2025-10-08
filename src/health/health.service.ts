// src/health/health.service.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { DatabasePrismaService } from '../database/database-prisma.service';
import { LoggerService } from '../logger/logger.service';
import { HEALTH_CHECK_INTERVAL_MS } from '../common/constants';
import {
  LivenessStatus,
  ReadinessStatus,
  DependencyStatus,
} from './health.interface';

@Injectable()
export class HealthService implements OnApplicationShutdown {
  private readonly intervalMs = HEALTH_CHECK_INTERVAL_MS;
  private healthInterval?: NodeJS.Timeout;

  constructor(
    private readonly dbService: DatabasePrismaService,
    private readonly logger: LoggerService,
  ) {
    this.startPeriodicHealthCheck();
  }

  private startPeriodicHealthCheck(): void {
    // Wrap async in void to satisfy ESLint no-misused-promises
    this.healthInterval = setInterval(
      () => void this.performHealthCheck(),
      this.intervalMs,
    );
  }

  private async performHealthCheck(): Promise<void> {
    const readiness = await this.checkReadiness();
    if (readiness.status === 'ok') {
      this.logger.log('Periodic health check passed', 'HealthService');
    } else {
      this.logger.warn(
        `Periodic health check failed: ${JSON.stringify(readiness.details)}`,
        'HealthService',
      );
    }
  }

  private async checkDatabase(logOnFail = true): Promise<DependencyStatus> {
    try {
      await this.dbService.$queryRaw`SELECT 1`;
      return { status: 'up' };
    } catch (err: unknown) {
      // Safely narrow unknown to Error
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      if (logOnFail) {
        this.logger.warn(
          `Database health check failed: ${errorMessage}`,
          'HealthService',
        );
      }

      return { status: 'down', message: errorMessage };
    }
  }

  // Liveness probe
  checkLiveness(): LivenessStatus {
    return {
      status: 'up',
      uptimeMs: process.uptime() * 1000,
    };
  }

  // Readiness probe
  async checkReadiness(): Promise<ReadinessStatus> {
    const db: DependencyStatus = await this.checkDatabase(false);
    return {
      status: db.status === 'up' ? 'ok' : 'error',
      details: { database: db },
    };
  }

  onApplicationShutdown(signal?: string): void {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.logger.log(
        `HealthService shutdown, cleared periodic health check interval. Signal: ${signal}`,
        'HealthService',
      );
    }
  }
}
