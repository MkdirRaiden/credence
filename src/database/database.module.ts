// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { DatabasePrismaService } from '@/database/database-prisma.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces/app-config.interface';

@Global()
@Module({
  providers: [
    {
      provide: DatabasePrismaService,
      useFactory: (configService: ConfigService<AppConfig>) => {
        const db = configService.getOrThrow('database');
        return new DatabasePrismaService(db.url);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DatabasePrismaService],
})
export class DatabaseModule {}

