// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { UsersModule } from '@/features/users/users.module';
import { HealthModule } from '@/health/health.module';
import { LoggerModule } from '@/logger/logger.module';
import { RootController } from '@/root.controller';
import { CommonModule } from '@/common/modules/common.module';
import { BootstrapModule } from '@/bootstrap/bootstrap.module';
import { AuthModule } from './features/auth/auth.module';

/**
 * Root application module with strict initialization order:
 * Core modules first, then system modules, then domain features.
 */
@Module({
  imports: [
    // Core: Config, logging, utilities loaded once globally
    ConfigModule,
    LoggerModule,
    CommonModule,
    DatabaseModule,
    // System: Infrastructure services
    BootstrapModule,
    HealthModule,
    // Domain: Feature modules
    UsersModule,
    AuthModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
