// src/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@/common/interfaces';

@Controller()
export class RootController {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  /**
   * Returns application metadata and configuration.
   */
  @Get()
  getInfo() {
    const appInfo = this.configService.get('app', { infer: true });
    const serverInfo = this.configService.get('server', { infer: true });
    const databaseInfo = this.configService.get('database', { infer: true });
    const jwtInfo = this.configService.get('jwt', { infer: true });

    const configuration = {
      server: serverInfo,
      database: {
        url: databaseInfo.url,
        maxRetries: databaseInfo.maxRetries,
        healthCheckIntervalMs: databaseInfo.healthCheckIntervalMs,
      },
      jwt: {
        jwtExpiration: jwtInfo.jwtExpiration,
        jwtRefreshExpiration: jwtInfo.jwtRefreshExpiration,
      },
    };

    return {
      name: appInfo.appName,
      version: appInfo.appVersion,
      environment: serverInfo.nodeEnv,
      config: configuration,
    };
  }
}
