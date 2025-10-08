//src/database/database-prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { retry } from '../common/utils/retry.util';
import { ConfigService } from '@nestjs/config';
import {
  DATABASE_MAX_RETRIES,
  DATABASE_RETRY_DELAY,
} from '../common/constants';

@Injectable()
export class DatabasePrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  // Retry configuration
  private readonly maxRetries = DATABASE_MAX_RETRIES;
  private readonly retryDelay = DATABASE_RETRY_DELAY;

  // Initialize PrismaClient with database URL from ConfigService
  constructor(configService: ConfigService) {
    const dbUrl = configService.get<string>('database.url') ?? '';
    super({
      datasources: { db: { url: dbUrl } },
    });
  }

  // Connect to the database with retry logic on module initialization
  async onModuleInit() {
    await retry(() => this.$connect(), {
      retries: this.maxRetries,
      delay: this.retryDelay,
      context: 'DatabasePrismaService.$connect',
    });
  }

  // Disconnect from the database on application shutdown
  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
