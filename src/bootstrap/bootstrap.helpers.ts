// src/bootstrap/bootstrap.helpers.ts
import { GLOBAL_PREFIX, PORT } from '@/common/constants';
import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import {INestApplication} from '@nestjs/common';

export class BootstrapHelpers {

  // start server and listen 
  public static async getServerInfo(app: INestApplication) {
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port', PORT);
    const prefix = configService.get<string>('globalPrefix', GLOBAL_PREFIX);
    return {
      port,
      prefix
    }
  }
  
  // Resolve and register global providers (interceptors, filters, etc.)
  public static resolveAndRegister<T>(
    moduleRef: ModuleRef,
    providers: (Type<T> | T)[],
    registerFn: (instance: T) => void,
  ) {
    providers.forEach((provider) => {
      if (typeof provider === 'object') {
        registerFn(provider as T);
      } else {
        const instance = moduleRef.get(provider as Type<T>, { strict: false });
        if (instance) registerFn(instance);
      }
    });
  }

  // Redirect / to root API prefix
  public static redirectToRoot(prefix: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.path === '/') {
        return res.redirect(`/${prefix}`);
      }
      next();
    };
  }
}
