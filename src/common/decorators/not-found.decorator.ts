// src/common/decorators/not-found.decorator.ts
import { NotFoundException } from '@nestjs/common';

type AsyncMethod<T = unknown, Args extends unknown[] = unknown[]> = (
  ...args: Args
) => Promise<T>;

/**
 * Method decorator that throws NotFoundException if the method result is null or undefined.
 * @param message - Message to use in NotFoundException
 */
export function NotFound<T, Args extends unknown[] = unknown[]>(message: string) {
  return function <
    TTarget extends object,
    TKey extends string | symbol
  >(
    target: TTarget,
    propertyKey: TKey,
    descriptor?: TypedPropertyDescriptor<AsyncMethod<T, Args>>,
  ): void | TypedPropertyDescriptor<AsyncMethod<T, Args>> {
    if (!descriptor?.value) return descriptor;

    const originalMethod = descriptor.value;

    descriptor.value = async function (this: TTarget, ...args: Args): Promise<T> {
      const result: T = await originalMethod.apply(this, args);
      if (result === null || result === undefined) {
        throw new NotFoundException(message);
      }
      return result;
    };

    return descriptor;
  };
}
