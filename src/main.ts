import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Bootstrap } from './bootstrap/bootstrap';
import { DEFAULT_PORT } from './common/constants';
import { ConfigHelper } from './config/config.helper';
import { ConfigService } from '@nestjs/config';

// Pre-configuration validation
ConfigHelper.validatePreConfig();

// Bootstrap function
async function bootstrap() {
  // Create app instance
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  // Centralized bootstrap
  await Bootstrap.init(app);

  // Use ConfigService to get port
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', DEFAULT_PORT);

  // Start listening and log via logger service
  await app.listen(port);
  // Log server startup info
  console.log(`Server running on http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();
