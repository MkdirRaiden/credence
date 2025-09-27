// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { DEFAULT_ENV } from 'src/common/constants';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // available everywhere
      envFilePath: `.env/.env.${process.env.NODE_ENV || DEFAULT_ENV}`, // dynamic per env
    }),
  ],
})
export class ConfigModule {}
