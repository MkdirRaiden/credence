// src/bootstrap/services/bootstrap.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import * as services from '@/bootstrap/services/internals';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly middlewareSetup: services.MiddlewareSetupService,
    private readonly globalSetup: services.GlobalSetupService,
    private readonly readiness: services.ReadinessService,
    private readonly server: services.ServerService,
    private readonly shutdown: services.ShutdownService,
  ) {}

  init(app: INestApplication): void {
    const moduleRef = app.get(ModuleRef);
    this.globalSetup.setup(app, moduleRef);
    this.middlewareSetup.setup(app);
    app.enableShutdownHooks();
    this.shutdown.registerHandlers(app);
  }

  async start(app: INestApplication): Promise<void> {
    await this.readiness.run();
    await this.server.start(app);
  }
}
