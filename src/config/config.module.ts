// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { getEnvFilePaths } from './config.helper';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: getEnvFilePaths(), // dynamic
      expandVariables: true,          // support ${VAR} inside env
    }),
  ],
})
export class ConfigModule {}
