// src/root.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@/common/interfaces';

@Injectable()
export class RootService {
  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  appInfo() {
    const appInfo = this.config.get('app', { infer: true });
    const serverInfo = this.config.get('server', { infer: true });

    return {
      name: appInfo.appName,
      version: appInfo.appVersion,
      environment: serverInfo.nodeEnv,
    };
  }
}
