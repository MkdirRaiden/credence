// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { DatabasePrismaService } from './database-prisma.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: DatabasePrismaService,
      useFactory: (configService: ConfigService) => {
        return new DatabasePrismaService(
          configService.get<string>('database.url')!,
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [DatabasePrismaService],
})
export class DatabaseModule {}
