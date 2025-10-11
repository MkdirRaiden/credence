import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { Request, Response, NextFunction } from 'express';

export class BootstrapHelpers {
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
