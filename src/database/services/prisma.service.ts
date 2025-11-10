// src/database/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { retry } from '@/common/utils';
import { LoggerService } from '@/logger/services';
import { LOG_CONTEXTS } from '@/common/constants';
import { softDeleteExtension } from '@/database/extensions';
import * as constants from '@/database/constants';

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.$extends(softDeleteExtension) as any;
  }

  async onModuleInit() {
    await retry(() => this.$connect(), {
      retries: constants.DATABASE_MAX_RETRIES,
      delay: constants.DATABASE_RETRY_DELAY,
      exponentialBackoff: true,
      logger: this.logger,
      context: 'DatabaseConnection',
    });
    this.logger.log('Database connected successfully', LOG_CONTEXTS.PRISMA);
  }

  async onApplicationShutdown() {
    await this.$disconnect();
    // Note: Logs twice due to Prisma $extends() creating proxy instance.
    // This is harmless - both share the same connection pool and 
    // $disconnect() is idempotent.
    this.logger.log('Database disconnected', LOG_CONTEXTS.PRISMA);
  }

  // Custom prisma method used in other services
  async runTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return this.$transaction(fn, {
      maxWait: constants.TRANSACTION_MAX_WAIT,
      timeout: constants.TRANSACTION_TIMEOUT,
    });
  }
}
