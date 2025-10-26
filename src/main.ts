// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Bootstrap } from '@/bootstrap/bootstrap';
import { BootstrapLogger } from '@/logger/bootstrap-logger';
import { LoggerService } from '@/logger/logger.service';
import { validatePreConfig } from '@/config/helpers';
import { getServerConfig, logStartup, runReadinessChecks } from '@/bootstrap/helpers';

const NODE_ENV = process.env.NODE_ENV;
const bootstrapLogger = new BootstrapLogger();

async function bootstrap() {
  // 1) Validate essential pre-configuration (e.g. env vars) before app starts
  validatePreConfig();

  bootstrapLogger.log(`Bootstrapping app, Env: ${NODE_ENV}...`, "Bootstrap.app");

  // 2) Create Nest app with a stateless bootstrap logger for early logs
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: NODE_ENV == "production",
    logger: bootstrapLogger,
  });

  // 3) Centralized global setup (security, CORS, prefix, pipes, filters, interceptors, shutdown
  Bootstrap.init(app);

  // 4) Swap to DI-backed logger so all runtime logs include env and optional correlation meta
  app.useLogger(app.get(LoggerService));

  // 5) Optional readiness checks before accepting traffic
  await runReadinessChecks(app);

  // 6) Start server and listen on configured port
  const { port, globalPrefix, host } = getServerConfig(app);
  await app.listen(port);
  // Log startup via DI logger
  logStartup(app, host, port, globalPrefix, NODE_ENV);
}

void bootstrap().catch((err) => {
  const message = `Bootstrap failed, err: ${err?.message}`;
  bootstrapLogger.error( message, err?.stack, "Bootstrap.error");
  process.exit(1);
});