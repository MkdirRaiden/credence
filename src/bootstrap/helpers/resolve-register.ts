// src/bootstrap/helpers/resolve-register.ts
import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { LoggerService } from '@/logger/logger.service';

export function resolveAndRegister<T>(
  moduleRef: ModuleRef,
  providers: Type<T>[],
  registerFn: (instance: T) => void,
  logger?: LoggerService,
) {
  providers.forEach((provider) => {
    const instance = moduleRef.get(provider, { strict: false });
    if (instance) {
      registerFn(instance);
    } else {
      logger?.warn(
        `Provider ${provider.name} not found for registration`,
        'Bootstrap',
      );
    }
  });
}
