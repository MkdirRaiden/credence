// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces/app-config.interface';
import { LoggerService } from '@/logger/logger.service';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: (
        config: ConfigService<AppConfig>,
        logger: LoggerService,
      ) => {
        const dbUrl = config.getOrThrow('database').url;
        return new PrismaService(dbUrl, logger);
      },
      inject: [ConfigService, LoggerService],
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
