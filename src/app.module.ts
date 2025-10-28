// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { UsersModule } from '@/features/users/users.module';
import { HealthModule } from '@/health/health.module';
import { LoggerModule } from '@/logger/logger.module';
import { RootController } from '@/root.controller';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [
    // Global Core Modules (loaded once)
    ConfigModule,
    LoggerModule,
    CommonModule,
    DatabaseModule,
    // System Modules
    HealthModule,
    UsersModule,
    // Domain Feature Modules
    UsersModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
