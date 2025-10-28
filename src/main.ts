// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Bootstrap } from '@/bootstrap/bootstrap';
import { BootstrapLogger } from '@/logger/bootstrap-logger';
import { LoggerService } from '@/logger/logger.service';
import { validatePreConfig } from '@/config/helpers';
import {
  startServer,
  runReadinessChecks,
  handleBootstrapError,
} from '@/bootstrap/helpers';

const nodeEnv = process.env.NODE_ENV;
const bootstrapLogger = new BootstrapLogger();

async function bootstrap() {
  // Log starting bootstrap process
  bootstrapLogger.log(`Bootstrapping app, Env: ${nodeEnv}...`, 'Bootstrap.app');

  // 1) Validate essential pre-configuration env vars
  validatePreConfig(bootstrapLogger);

  // 2) Create Nest app with a stateless bootstrap logger for early logs
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: nodeEnv === 'production',
    logger: bootstrapLogger,
  });

  // 3) Swap to DI-backed logger
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // 4) Centralized global setup security, pipes, filters, interceptors, etc.
  Bootstrap.init(app);

  // 5) Readiness checks before accepting traffic
  await runReadinessChecks(app);

  // 6) Start server, listen and log on configured port
  await startServer(app, logger);
}

void bootstrap().catch((err: unknown) =>
  handleBootstrapError(err, bootstrapLogger),
);
