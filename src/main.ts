// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Bootstrap } from '@/bootstrap/bootstrap';
import { BootstrapLogger } from '@/logger/logger.bootstrap';
import { LoggerService } from '@/logger/logger.service';
import { validatePreConfig } from '@/config/helpers';
import { runReadinessChecks , getServerInfo, logStartup } from '@/bootstrap/helpers';

async function bootstrap() {
  // 1) Validate essential pre-configuration (e.g. env vars) before app starts
  validatePreConfig();

  const isProd = process.env.NODE_ENV === 'production';

  // 2) Create Nest app with a stateless bootstrap logger for early logs
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: isProd,
    logger: new BootstrapLogger(),
  });

  // 3) Centralized global setup (security, CORS, prefix, pipes, filters, interceptors, shutdown
  Bootstrap.init(app);

  // 4) Swap to DI-backed logger so all runtime logs include env and optional correlation meta
  app.useLogger(app.get(LoggerService));

  // 5) Optional readiness checks before accepting traffic
  await runReadinessChecks(app);

  // 6) Start server and listen on configured port
  const { port, prefix, host } = getServerInfo(app);
  await app.listen(port);

  // Log startup via DI logger
  logStartup(app, host, port, prefix);
}

void bootstrap();