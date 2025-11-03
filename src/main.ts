// src/main.ts
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { BootstrapService } from '@/bootstrap/bootstrap.service';
import { ShutdownService } from '@/bootstrap/services';
import { BootstrapLogger } from '@/logger/bootstrap-logger';
import { LoggerService } from '@/logger/logger.service';
import { validatePreConfig } from '@/config/helpers';
import { handleBootstrapError } from '@/bootstrap/helpers';

const nodeEnv = process.env.NODE_ENV;
const bootstrapLogger = new BootstrapLogger();
let app: INestApplication | null = null;

// Fail fast on missing/invalid env vars before creating NestJS app
validatePreConfig(bootstrapLogger);

/**
 * Bootstrap the NestJS application with strict initialization order.
 * Logger swap happens after app creation because LoggerService requires the DI container.
 */
async function bootstrap(): Promise<void> {
  bootstrapLogger.log(`Bootstrapping app, Env: ${nodeEnv}...`, 'Bootstrap.app');

  // Phase 1: Create app with buffered logs
  app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: nodeEnv === 'production',
    logger: bootstrapLogger,
  });

  // Phase 2: Swap to DI-backed logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Phase 3: Configure middleware, pipes, filters, interceptors
  const bootstrapService = app.get(BootstrapService);
  bootstrapService.init(app);

  // Phase 4-5: Run readiness checks and start server
  await bootstrapService.start(app);

  // Phase 6: Register graceful shutdown handlers
  const shutdownService = app.get(ShutdownService);
  shutdownService.registerHandlers(app);
}

// Execute bootstrap with centralized error handling
void bootstrap().catch(
  (err: unknown): Promise<never> =>
   handleBootstrapError(err, bootstrapLogger, app),
);