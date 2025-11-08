// src/bootstrap/helpers/resolve-register.ts
import { Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { LoggerService } from '@/logger/services';
import { CRITICAL_PROVIDERS } from '@/common/modules';
import { LOG_CONTEXTS } from '@/logger/constants';

/**
 * Dynamically resolves and registers providers from DI container after initialization.
 */
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
      const isCritical = CRITICAL_PROVIDERS.includes(provider.name);
      const message = `Provider ${provider.name} not found for registration`;
      if (isCritical) {
        throw new Error(`CRITICAL: ${message}`);
      } else {
        logger?.warn(message, LOG_CONTEXTS.BOOTSTRAP);
      }
    }
  });
}
