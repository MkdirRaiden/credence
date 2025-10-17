//src/bootstrap/helpers/server.info.ts
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { GLOBAL_PREFIX, PORT, HOST } from '@/common/constants';

export function getServerInfo(app: INestApplication) {
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', PORT);
  const prefix = configService.get<string>('globalPrefix', GLOBAL_PREFIX);
  const host = configService.get<string>('host', HOST);
  return { port, prefix, host };
}
