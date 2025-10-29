// src/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extractConfig } from '@/common/utils';
import type { AppConfig } from '@/common/interfaces/app-config.interface';

@Controller()
export class RootController {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  @Get()
  getInfo(): { name: string; version: string; environment: string } {
    const { appName, appVersion, nodeEnv } = extractConfig(
      this.configService,
      ['appName', 'appVersion', 'nodeEnv'] as const,
    );

    return {
      name: appName,
      version: appVersion,
      environment: nodeEnv,
    };
  }
}
