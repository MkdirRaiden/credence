// src/bootstrap/bootstrap.ts
import {
  INestApplication,
  ValidationPipe,
  NestInterceptor,
  ExceptionFilter,
  Type,
} from '@nestjs/common';
import helmet from 'helmet';
import { ModuleRef } from '@nestjs/core';
import { GLOBAL_FILTERS, GLOBAL_INTERCEPTORS } from './bootstrap.config';
import { ConfigService } from '@nestjs/config';

export class Bootstrap {
  // Configure essential middlewares (security, etc.)
  private static configureMiddlewares(app: INestApplication) {
    app.use(helmet());

    const configService = app.get(ConfigService);
    const allowedOrigins = configService.get<string[]>('allowedOrigins');

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });
  }

  // Register global pipes, filters, and interceptors
  private static configureGlobals(app: INestApplication, moduleRef: ModuleRef) {
    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    const resolveAndRegister = <T>(
      providers: (Type<T> | T)[],
      registerFn: (instance: T) => void,
    ) => {
      providers.forEach((provider) => {
        if (typeof provider === 'object') {
          registerFn(provider as T);
        } else {
          const instance = moduleRef.get(provider as Type<T>, {
            strict: false,
          });
          if (instance) registerFn(instance);
        }
      });
    };

    resolveAndRegister<NestInterceptor>(GLOBAL_INTERCEPTORS, (i) =>
      app.useGlobalInterceptors(i),
    );

    resolveAndRegister<ExceptionFilter>(GLOBAL_FILTERS, (f) =>
      app.useGlobalFilters(f),
    );
  }

  private static configureShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
  }

  public static init(app: INestApplication) {
    const moduleRef = app.get(ModuleRef);
    this.configureMiddlewares(app);
    this.configureGlobals(app, moduleRef);
    this.configureShutdownHooks(app);
  }
}
