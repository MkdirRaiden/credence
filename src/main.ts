import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import {DEFAULT_PORT} from './common/constants';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  app.use(helmet());

  // Global validation stateless pipe
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
  );

  // Global response formatting
  app.useGlobalInterceptors(app.get(ResponseInterceptor));

  // Global exception handling — get filters from DI
  app.useGlobalFilters
  (app.get(PrismaClientExceptionFilter), app.get(AllExceptionsFilter));

  // Graceful shutdown on SIGTERM, SIGINT
  app.enableShutdownHooks();

  const port = process.env.PORT || DEFAULT_PORT;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}/api`);
}


bootstrap();
