import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './features/users/users.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';
import { FiltersModule } from './common/filters/filters.module';
import { InterceptorsModule } from './common/interceptors/response.module';
import { AppController } from './app.controller';


@Module({
  imports: [
    //Base modules
    ConfigModule, //Global
    DatabaseModule, //Global
    LoggerModule, //Global
    FiltersModule,
    HealthModule,
    InterceptorsModule,
    //Feature modules
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
