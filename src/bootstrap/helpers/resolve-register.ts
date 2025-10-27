// src/bootstrap/helpers/resolve-register.ts
import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { LoggerService } from '@/logger/logger.service';

export function resolveAndRegister<T>(
  moduleRef: ModuleRef,
  providers: (Type<T> | T)[],
  registerFn: (instance: T) => void,
  logger?: LoggerService,
) {
  providers.forEach((provider) => {
    if (typeof provider === 'object') {
      registerFn(provider as T);
      return;
    }

    const instance = moduleRef.get(provider as Type<T>, { strict: false });
    if (instance) {
      registerFn(instance);
    } else {
      logger?.warn(
        'Global provider not found for registration',
        (provider as Type<T>)?.name ?? String(provider)
      );
    }
  });
}