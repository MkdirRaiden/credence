// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { LoggerModule } from '@/logger/logger.module';
import { CommonModule } from '@/common/modules/common.module';
import { DatabaseModule } from '@/database/database.module';
import { BootstrapModule } from '@/bootstrap/bootstrap.module';
import { HealthModule } from '@/health/health.module';
import { UsersModule } from '@/features/users/users.module';
import { RootController } from '@/root.controller';
import { AuthModule } from '@/features/auth/auth.module';
import { RefreshTokenModule } from '@/features/shared/tokens/token.module';
import { SecurityModule } from '@/features/shared/security/security.module';
import { RootService } from '@/root.service';

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
    // Domain: Feature modules shared modules
    RefreshTokenModule,
    SecurityModule,
    // Domain: Features modules
    UsersModule,
    AuthModule,
  ],
  providers: [RootService],
  controllers: [RootController],
})
export class AppModule {}
