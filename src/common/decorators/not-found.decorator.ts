// src/common/decorators/not-found.decorator.ts
import { NotFoundException } from '@nestjs/common';

type AsyncMethod<T = unknown, Args extends unknown[] = unknown[]> = (
  ...args: Args
) => Promise<T>;

export function NotFound<T, Args extends unknown[] = unknown[]>(
  message: string,
) {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<AsyncMethod<T, Args>>,
  ): TypedPropertyDescriptor<AsyncMethod<T, Args>> {
    if (!descriptor.value) return descriptor;

    const originalMethod: AsyncMethod<T, Args> = descriptor.value;

    // Typed wrapper to satisfy ESLint
    descriptor.value = async function (...args: Args): Promise<T> {
      // Explicitly type the result
      const result: T = (await originalMethod.apply(this, args)) as T;

      if (result === null || result === undefined) {
        throw new NotFoundException(message);
      }
      return result;
    } as AsyncMethod<T, Args>; // cast ensures descriptor.value has correct type

    return descriptor;
  };
}
