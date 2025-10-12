// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { Bootstrap } from '@/bootstrap/bootstrap';
import { ConfigHelper } from '@/config/config.helper';
import { BootstrapHelpers } from '@/bootstrap/bootstrap.helpers';
import { BootstrapLogger } from './logger/bootstrap-logger';

// Pre-configuration validation
ConfigHelper.validatePreConfig();

// Bootstrap function
async function bootstrap() {
  // Create app instance
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  // Centralized bootstrap
  Bootstrap.init(app);

  //start server
  const { port, prefix } = await BootstrapHelpers.getServerInfo(app);
  await app.listen(port);

  // Log server info
  const message = `Server running on http://localhost:${port}/${prefix}`;
  BootstrapLogger.log(message, 'Bootstrap');
}

void bootstrap();
