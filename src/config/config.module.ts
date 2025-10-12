// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { ConfigHelper } from '@/config/config.helper';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ConfigHelper.getEnvFilePaths(),
      expandVariables: true,
    }),
  ],
})
export class ConfigModule {}
