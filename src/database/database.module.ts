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
        const databaseUrl = database.url;
        return new PrismaService(databaseUrl, logger);
      },
      inject: [ConfigService, LoggerService],
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
