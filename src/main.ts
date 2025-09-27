import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { DEFAULT_PORT } from './common/constants';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const logger = app.get(LoggerService);

  // Global API prefix
  app.setGlobalPrefix('api');

  // Security headers
  app.use(helmet());

  // Minimal global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Centralized logging & response formatting
  app.useGlobalInterceptors(app.get(ResponseInterceptor));

  // Centralized exception handling
  app.useGlobalFilters(
    app.get(ValidationExceptionFilter),
    app.get(PrismaClientExceptionFilter),
    app.get(AllExceptionsFilter)
  );

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  const port = process.env.PORT || DEFAULT_PORT;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();
