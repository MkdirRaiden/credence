import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Connect to DB when module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // Disconnect when module shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
