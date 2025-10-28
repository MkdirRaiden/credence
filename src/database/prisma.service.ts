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
    await retry(() => this.$connect(), {
      retries: DATABASE_MAX_RETRIES,
      delay: DATABASE_RETRY_DELAY,
      context: 'PrismaConnection',
      logger: this.logger,
    });
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
