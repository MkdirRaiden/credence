// src/database/prisma.service.ts
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, retry } from '@/common/utils';
import { CoreExceptionFactories } from '@/common/exceptions';
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
    await asyncHandler(
      () =>
        retry(() => this.$connect(), {
          retries: DATABASE_MAX_RETRIES,
          delay: DATABASE_RETRY_DELAY,
          context: 'PrismaConnection',
          exponentialBackoff: true,
          logger: this.logger,
        }),
      {
        context: 'PrismaService.onModuleInit',
        errorFactory: CoreExceptionFactories.databaseConnection,
      },
    );

    this.logger.log('Database connected successfully', 'PrismaService');
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
