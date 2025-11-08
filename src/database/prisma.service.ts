// src/database/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { retry } from '@/common/utils';
import { LoggerService } from '@/logger/services';
import { LOG_CONTEXTS } from '@/logger/constants';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(
    dbUrl: string,
    private readonly maxRetries: number,
    private readonly retryDelays: number,
    private readonly logger: LoggerService,
  ) {
    super({ datasources: { db: { url: dbUrl } } });
  }

  async onModuleInit() {
    await retry(() => this.$connect(), {
      retries: this.maxRetries,
      delay: this.retryDelays,
      exponentialBackoff: true,
      logger: this.logger,
      context: 'DatabaseConnection',
    });
    this.logger.log('Database connected successfully', LOG_CONTEXTS.PRISMA);
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
