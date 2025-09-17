import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strips unexpected fields
      forbidNonWhitelisted: true, // throws error on unexpected fields
      transform: true,          // auto-transforms payloads to DTO instances
    }),
  );
  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();