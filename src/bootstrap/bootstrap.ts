// src/bootstrap/bootstrap.ts
import {
  INestApplication,
  ValidationPipe,
  NestInterceptor,
  ExceptionFilter,
} from '@nestjs/common';
import { GLOBAL_FILTERS, GLOBAL_INTERCEPTORS } from '@/common/common.config';
import { resolveAndRegister, getServerConfig } from '@/bootstrap/helpers';
import { ModuleRef } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
import { LoggerService } from '@/logger/logger.service';

export class Bootstrap {
  private static configureMiddlewares(app: INestApplication): void {
    const { allowedOrigins, globalPrefix } = getServerConfig(app);
    // Security middlewares
    app.use(helmet());
    // Compression middleware for optimal response sizes
    app.use(compression());
    // CORS configuration
    app.enableCors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
      credentials: true,
    });
    // Global prefix for all routes except root and health
    app.setGlobalPrefix(globalPrefix, {exclude: [ '/', 'health/(.*)' ]}); 
  }

  private static configureGlobals(
    app: INestApplication,
    moduleRef: ModuleRef,
  ): void {
    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    const logger = app.get(LoggerService);
    // Global interceptors registration
    resolveAndRegister<NestInterceptor>(
      moduleRef,
      GLOBAL_INTERCEPTORS,
      (i) => app.useGlobalInterceptors(i),
      logger,
    );
    // Global filters registration
    resolveAndRegister<ExceptionFilter>(
      moduleRef,
      GLOBAL_FILTERS,
      (f) => app.useGlobalFilters(f),
      logger,
    );
  }

  private static configureShutdownHooks(app: INestApplication): void {
    app.enableShutdownHooks();
  }

  static init(app: INestApplication): void {
    const moduleRef = app.get(ModuleRef);
    this.configureMiddlewares(app);
    this.configureGlobals(app, moduleRef);
    this.configureShutdownHooks(app);
  }
}
