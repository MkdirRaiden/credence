import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Bootstrap } from './bootstrap/bootstrap';
import { DEFAULT_PORT, GLOBAL_PREFIX } from './common/constants';
import { ConfigHelper } from './config/config.helper';
import { ConfigService } from '@nestjs/config';
import { BootstrapLogger } from '@/logger/bootstrap-logger';

// Pre-configuration validation
ConfigHelper.validatePreConfig();

// Bootstrap function
async function bootstrap() {
  // Create app instance
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  // Centralized bootstrap
  Bootstrap.init(app);

  // Use ConfigService to get port
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', DEFAULT_PORT);
  const prefix = configService.get<string>('globalPrefix', GLOBAL_PREFIX);

  // Start listening and mark as intentionally ignored promise
  await app.listen(port);

  // Log server startup info
  BootstrapLogger.log(`Server running on http://localhost:${port}/${prefix}`);
}

void bootstrap();
