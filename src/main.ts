// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { BootstrapService } from '@/bootstrap/bootstrap.service';
import { BootstrapLogger } from '@/logger/bootstrap-logger';
import { LoggerService } from '@/logger/logger.service';
import { validatePreConfig } from '@/config/helpers';
import { handleBootstrapError } from '@/bootstrap/helpers';

// Determine the current Node environment
const nodeEnv = process.env.NODE_ENV;
const bootstrapLogger = new BootstrapLogger();

// Pre-validate critical env vars and full config before app bootstrap
validatePreConfig(bootstrapLogger);

// Main bootstrap function to initialize and start the NestJS application
async function bootstrap(): Promise<void> {
  // Log starting bootstrap process
  bootstrapLogger.log(`Bootstrapping app, Env: ${nodeEnv}...`, 'Bootstrap.app');

  // 1) Create Nest app with a stateless bootstrap logger for early logs
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: nodeEnv === 'production',
    logger: bootstrapLogger,
  });

  // 2) Swap to DI-backed logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // 3) Centralized global setup security, pipes, filters, interceptors, etc.
  const bootstrapService = app.get(BootstrapService);
  bootstrapService.init(app);

  // 4) Readiness checks before accepting traffic
  await bootstrapService.runAppReadinessChecks(app);

  // 5) Start server, listen and log on configured port
  await bootstrapService.startServer(app);
}

// Execute the bootstrap function and handle any errors
void bootstrap().catch((err: unknown): never =>
  handleBootstrapError(err, bootstrapLogger),
);
