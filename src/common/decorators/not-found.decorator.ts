// src/common/decorators/not-found.decorator.ts
import { NotFoundException } from '@nestjs/common';

/**
 * Throws NotFoundException if async method returns null or undefined.
 * Decorator preserves original errors and method signatures.
 */
export function NotFound(message: string) {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<unknown>;

    descriptor.value = async function (
      this: unknown,
      ...args: unknown[]
    ): Promise<unknown> {
      const result = await originalMethod.apply(this, args);

      if (result === null || result === undefined) {
        throw new NotFoundException(message);
      }

      return result;
    };

    return descriptor;
  };
}
