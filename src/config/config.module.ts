// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { getEnvFilePaths } from '@/config/helpers';
import { configValidationSchema } from '@/config/config.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
      expandVariables: true,
      validationSchema: configValidationSchema  //runtime validation
    }),
  ],
})
export class ConfigModule {}
