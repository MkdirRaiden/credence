// src/database/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { retry } from '@/common/utils';
import { DATABASE_MAX_RETRIES, DATABASE_RETRY_DELAY } from '@/common/constants';
import { LoggerService } from '@/logger/logger.service';

/**
 * Extended PrismaClient with retry logic and graceful shutdown.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(
    dbUrl: string,
    private readonly logger: LoggerService,
  ) {
    super({ datasources: { db: { url: dbUrl } } });
  }

  async onModuleInit() {
    try {
      await retry(() => this.$connect(), {
        retries: DATABASE_MAX_RETRIES,
        delay: DATABASE_RETRY_DELAY,
        exponentialBackoff: true,
      });
      this.logger.log('Database connected successfully', 'PrismaService');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(
        `Database connection failed: ${message}`,
        'PrismaService',
      );
      throw err; // Re-throw to block app startup
    }
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
