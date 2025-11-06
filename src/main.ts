// src/main.ts
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { BootstrapService } from '@/bootstrap/services';
import { BootstrapLogger, LoggerService } from '@/logger/services';
import { validatePreConfig } from '@/config/helpers';
import { handleBootstrapError } from '@/bootstrap/helpers';

const nodeEnv = process.env.NODE_ENV;
const bootstrapLogger = new BootstrapLogger();
let app: INestApplication | null = null;

/**
 * Bootstrap the NestJS application with strict initialization order.
 * Logger swap happens after app creation because LoggerService requires the DI container.
 */
async function bootstrap(): Promise<void> {
  bootstrapLogger.log(`Bootstrapping app, Env: ${nodeEnv}...`, 'Bootstrap.app');

  // phase 1: Fail fast on missing/invalid env vars before creating NestJS app
  await validatePreConfig(bootstrapLogger);

  // Phase 2: Create app with buffered logs
  app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: nodeEnv === 'production',
    logger: bootstrapLogger,
  });

  // Phase 3: Swap to DI-backed logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Phase 4: Configure middleware, pipes, filters, interceptors, shutdown handlers
  const bootstrapService = app.get(BootstrapService);
  bootstrapService.init(app);

  // Phase 5-6: Run readiness checks and start server
  await bootstrapService.start(app);
}

// Execute bootstrap with centralized error handling
void bootstrap().catch(
  (err: unknown): Promise<never> =>
    handleBootstrapError(err, bootstrapLogger, app),
);
