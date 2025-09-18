import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 Global DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws error on unknown properties
      transform: true, // transforms payloads into DTO instances
    }),
  );

  // 🔹 Global response wrapper for success
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 🔹 Global error handlers
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaClientExceptionFilter(),
  );

  await app.listen(5000);
  console.log('🚀 Server running on http://localhost:5000');
}
bootstrap();
