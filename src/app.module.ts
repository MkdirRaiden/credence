// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { UsersModule } from '@/features/users/users.module';
import { HealthModule } from '@/health/health.module';
import { LoggerModule } from '@/logger/logger.module';
import { RootController } from '@/root.controller';
import { CommonModule } from '@/common/common.module';
import { BootstrapModule } from '@/bootstrap/bootstrap.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    // Global Core Modules (loaded once)
    ConfigModule,
    LoggerModule,
    CommonModule,
    DatabaseModule,
    // System Modules
    BootstrapModule,
    HealthModule,
    // Domain Feature Modules
    UsersModule,
    AuthModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
