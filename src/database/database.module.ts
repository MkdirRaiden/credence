// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { DatabasePrismaService } from '@/database/database-prisma.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces/app-config.interface';
import { LoggerService } from '@/logger/logger.service';

@Global()
@Module({
  providers: [
    {
      provide: DatabasePrismaService,
      useFactory: (configService: ConfigService<AppConfig>,
      logger: LoggerService
      ) => {
        const db = configService.getOrThrow('database');
        return new DatabasePrismaService(db.url, logger);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DatabasePrismaService],
})
export class DatabaseModule {}

