// src/bootstrap/services/internal/global-setup.service.ts
import {
  Injectable,
  INestApplication,
  ValidationPipe,
  NestInterceptor,
  ExceptionFilter,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { LoggerService } from '@/logger/services';
import { resolveAndRegister } from '@/bootstrap/helpers';
import { GLOBAL_INTERCEPTORS, GLOBAL_FILTERS } from '@/common/modules';

/**
 * Configures global pipes, interceptors, and exception filters after DI initialization.
 */
@Injectable()
export class GlobalSetupService {
  constructor(private readonly logger: LoggerService) {}

  // Order: ValidationPipe → Interceptors → Filters
  setup(app: INestApplication, moduleRef: ModuleRef): void {
    this.setupValidationPipe(app);
    this.setupInterceptors(app, moduleRef);
    this.setupFilters(app, moduleRef);
  }

  private setupValidationPipe(app: INestApplication): void {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
  }

  private setupInterceptors(app: INestApplication, moduleRef: ModuleRef): void {
    resolveAndRegister<NestInterceptor>(
      moduleRef,
      GLOBAL_INTERCEPTORS,
      (i) => app.useGlobalInterceptors(i),
      this.logger,
    );
  }

  private setupFilters(app: INestApplication, moduleRef: ModuleRef): void {
    resolveAndRegister<ExceptionFilter>(
      moduleRef,
      GLOBAL_FILTERS,
      (f) => app.useGlobalFilters(f),
      this.logger,
    );
  }
}
