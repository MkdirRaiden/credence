// src/health/health.service.ts
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { DatabasePrismaService } from '../database/database-prisma.service';
import { LoggerService } from '../logger/logger.service';
import { HEALTH_CHECK_INTERVAL_MS } from '../common/constants';

@Injectable()
export class HealthService implements OnApplicationShutdown {
  private intervalMs = HEALTH_CHECK_INTERVAL_MS;
  private healthInterval: NodeJS.Timeout;

  constructor(
    private readonly dbService: DatabasePrismaService,
    private readonly logger: LoggerService,
  ) {
    this.startPeriodicHealthCheck();
  }

  // Check if DB is reachable
  async checkDatabase(logOnFail = true): Promise<{ status: string; message?: string }> {
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

  // Liveness probe: Is app running?
  async checkLiveness(): Promise<{ status: string }> {
    return { status: 'up' };
  }

  // Readiness probe: Are dependencies ready?
  async checkReadiness(): Promise<{ status: string; details: any }> {
    const db = await this.checkDatabase(false); // suppress logs; exception filter handles critical logs
    return {
      status: db.status === 'up' ? 'ok' : 'error',
      details: { database: db },
    };
  }

  // Periodically log health for monitoring 
  private startPeriodicHealthCheck() {
    this.healthInterval = setInterval(async () => {
      const health = await this.checkReadiness();
      if (health.status === 'ok') {
        this.logger.log('Periodic health check passed', 'HealthService');
      } else {
        this.logger.warn(`Periodic health check failed: ${JSON.stringify(health.details)}`, 'HealthService');
      }
    }, this.intervalMs);
  }

  // Clear interval on shutdown
  onApplicationShutdown(signal?: string) {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.logger.log(`HealthService shutdown, cleared periodic health check interval. Signal: ${signal}`, 'HealthService');
    }
  }
}
