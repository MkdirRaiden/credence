// src/bootstrap/bootstrap.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ModuleRef } from '@nestjs/core';
import { GLOBAL_FILTERS, GLOBAL_INTERCEPTORS } from './bootstrap.config';

export class Bootstrap {
  // Configure essential middlewares (security, etc.)
  private static configureMiddlewares(app: INestApplication) {
    app.use(helmet());
  }

  // Register global pipes, filters, and interceptors
  private static configureGlobals(app: INestApplication, moduleRef: ModuleRef) {
    // Global API prefix
    app.setGlobalPrefix('api');

    // Directly register global ValidationPipe
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    // Helper to resolve and register DI-based providers
    const resolveAndRegister = (providers: any[], registerFn: (instance: any) => void) => {
      providers.forEach((provider) => {
        if (typeof provider === 'object') {
          registerFn(provider); // Already an instance
        } else {
          const instance = moduleRef.get(provider, { strict: false });
          if (instance) registerFn(instance); // Resolve class from DI
        }
      });
    };

    // Interceptors
    resolveAndRegister(GLOBAL_INTERCEPTORS, (i) => app.useGlobalInterceptors(i));

    // Filters
    resolveAndRegister(GLOBAL_FILTERS, (f) => app.useGlobalFilters(f));
  }

  // Configure graceful shutdown hooks
  private static configureShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
  }

  // Bootstrap initialization
  public static async init(app: INestApplication) {
    const moduleRef = app.get(ModuleRef);
    this.configureMiddlewares(app);
    this.configureGlobals(app, moduleRef);
    this.configureShutdownHooks(app);
  }
}
