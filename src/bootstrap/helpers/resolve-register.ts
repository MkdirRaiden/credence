// src/bootstrap/helpers/resolve-register.ts
import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BootstrapLogger } from '@/logger/bootstrap-logger';

export function resolveAndRegister<T>(
  moduleRef: ModuleRef,
  providers: (Type<T> | T)[],
  registerFn: (instance: T) => void,
  logger?: BootstrapLogger, // optional param
) {
  const log = logger ?? new BootstrapLogger(); // default to bootstrapLogger

  providers.forEach((provider) => {
    if (typeof provider === 'object') {
      registerFn(provider as T);
      return;
    }

    const instance = moduleRef.get(provider as Type<T>, { strict: false });
    if (instance) {
      registerFn(instance);
    } else {
      log.warn(
        'Global provider not found for registration',
        (provider as Type<T>)?.name ?? String(provider),
      );
    }
  });
}