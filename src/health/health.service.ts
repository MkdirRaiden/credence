// src/health/health.service.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { DatabasePrismaService } from '../database/database-prisma.service';
import { LoggerService } from '../logger/logger.service';
import { HEALTH_CHECK_INTERVAL_MS } from '../common/constants';
import { LivenessStatus, ReadinessStatus, DependencyStatus } 
from './health.interface';

@Injectable()
export class HealthService implements OnApplicationShutdown {
  //private properties
  private intervalMs = HEALTH_CHECK_INTERVAL_MS;
  private healthInterval: NodeJS.Timeout;

  //dependency injections
  constructor(
    private readonly dbService: DatabasePrismaService,
    private readonly logger: LoggerService,
  ) {
    this.startPeriodicHealthCheck();
  }

  // Periodically log health for observability (private method, cannot accessed outside)
  private startPeriodicHealthCheck() {
    this.healthInterval = setInterval(async () => {
      const readiness = await this.checkReadiness();
      if (readiness.status === 'ok') {
        this.logger.log('Periodic health check passed', 'HealthService');
      } else {
        this.logger.warn(`Periodic health check failed: ${JSON.stringify(readiness.details)}`, 'HealthService');
      }
    }, this.intervalMs);
  }

  // Check DB health (private method cannot be accessed outside)
  private async checkDatabase(logOnFail = true): Promise<DependencyStatus> {
    try {
      await this.dbService.$queryRaw`SELECT 1`;
      return { status: 'up' };
    } catch (err: any) {
      if (logOnFail) {
        this.logger.warn(`Database health check failed: ${err.message}`, 'HealthService');
      }
      return { status: 'down', message: err.message };
    }
  }

  // Liveness probe
  async checkLiveness(): Promise<LivenessStatus> {
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

  // Cleanup interval on shutdown
  onApplicationShutdown(signal?: string) {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.logger.log(`HealthService shutdown, cleared periodic health check interval. Signal: ${signal}`, 'HealthService');
    }
  }
}
