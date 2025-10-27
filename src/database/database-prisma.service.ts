// src/database/database-prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { retry } from '@/common/utils';
import { DATABASE_MAX_RETRIES, DATABASE_RETRY_DELAY } from '@/common/constants';
import { LoggerService } from '@/logger/logger.service';
import { BootstrapLogger } from '@/logger/bootstrap-logger';

@Injectable()
export class DatabasePrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  // Retry settings
  private readonly maxRetries = DATABASE_MAX_RETRIES;
  private readonly retryDelay = DATABASE_RETRY_DELAY;
  private readonly logger: LoggerService | BootstrapLogger;

  // Dependency injection of the database URL
  constructor(dbUrl: string, logger?: LoggerService) {
    super({ datasources: { db: { url: dbUrl } }});
    this.logger = logger ?? new BootstrapLogger();
  }

  // Lifecycle hook - connect with retries
  async onModuleInit() {
    await retry(() => this.$connect(), {
      retries: this.maxRetries,
      delay: this.retryDelay,
      context: 'DatabasePrismaService.$connect',
      logger: this.logger
    });
  }

  // Lifecycle hook - disconnect
  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
