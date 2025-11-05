//src/logger/logger.module.ts
import { Global, Module } from '@nestjs/common';
import { LoggerService } from '@/logger/services';

/**
 * Global logger module providing LoggerService singleton injection throughout the app.
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
