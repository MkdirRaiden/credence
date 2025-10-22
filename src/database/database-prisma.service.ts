// src/database/database-prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { retry } from '@/common/utils';
import { DATABASE_MAX_RETRIES, DATABASE_RETRY_DELAY } from '@/common/constants';

@Injectable()
export class DatabasePrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  // Retry settings
  private readonly maxRetries = DATABASE_MAX_RETRIES;
  private readonly retryDelay = DATABASE_RETRY_DELAY;

  // Dependency injection of the database URL
  constructor(dbUrl: string) {
    super({
      datasources: { db: { url: dbUrl } }, // initialize with the correct URL
    });
  }

  // Lifecycle hook - connect with retries
  async onModuleInit() {
    await retry(() => this.$connect(), {
      retries: this.maxRetries,
      delay: this.retryDelay,
      context: 'DatabasePrismaService.$connect',
    });
  }

  // Lifecycle hook - disconnect
  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
