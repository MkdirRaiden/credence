// src/bootstrap/helpers/resolve-register.ts
import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BootstrapLogger } from '@/logger/bootstrap-logger';

const bootstrapLogger = new BootstrapLogger();

export function resolveAndRegister<T>(
  moduleRef: ModuleRef,
  providers: (Type<T> | T)[],
  registerFn: (instance: T) => void, // <-- keep this, now TS understands type
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
      bootstrapLogger.warn(
        'Global provider not found for registration',
        (provider as Type<T>)?.name ?? String(provider),
      );
    }
  });
}
