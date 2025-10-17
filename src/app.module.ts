// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { UsersModule } from '@/features/users/users.module';
import { HealthModule } from '@/health/health.module';
import { LoggerModule } from '@/logger/logger.module';
import { RootController } from '@/root.controller';

@Module({
  imports: [
    //Base modules
    ConfigModule, //Global
    DatabaseModule, //Global
    LoggerModule, //Global
    HealthModule,
    //Feature modules
    UsersModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
