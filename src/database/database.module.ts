// src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import { LoggerService } from '@/logger/services';
import type { AppConfig } from '@/common/interfaces';

/**
 * Global database module providing PrismaService singleton.
 */
@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: (
        configService: ConfigService<AppConfig, true>,
        logger: LoggerService,
      ) => {
        const database = configService.get('database', { infer: true });
        const { url, maxRetries, retryDelays } = database;
        return new PrismaService(url, maxRetries, retryDelays, logger);
      },
      inject: [ConfigService, LoggerService],
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
