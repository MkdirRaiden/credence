// src/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractConfig } from '@/common/utils';
import type { AppConfig } from '@/common/interfaces';

@Controller()
export class RootController {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  /**
   * Returns application metadata from environment configuration.
   */
  @Get()
  getInfo(): { name: string; version: string; environment: string } {
    const { appName, appVersion, nodeEnv } = extractConfig(this.configService, [
      'appName',
      'appVersion',
      'nodeEnv',
    ] as const);

    return {
      name: appName,
      version: appVersion,
      environment: nodeEnv,
    };
  }
}
