// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { DatabasePrismaService } from './database-prisma.service';

@Global()
@Module({
  providers: [DatabasePrismaService],
  exports: [DatabasePrismaService],
})
export class DatabaseModule {}
