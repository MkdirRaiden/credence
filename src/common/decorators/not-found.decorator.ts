// src/common/decorators/not-found.decorator.ts
import { NotFoundException } from '@nestjs/common';

export function NotFound(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (result === null || result === undefined) {
        throw new NotFoundException(message);
      }
      return result;
    };

    return descriptor;
  };
}
