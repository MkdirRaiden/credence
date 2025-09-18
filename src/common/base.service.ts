// common/base.service.ts
import { NotFoundException } from '@nestjs/common';

export abstract class BaseService<T> {
  protected throwIfNotFound(entity: T | null, message: string): T {
    if (!entity) throw new NotFoundException(message);
    return entity;
  }
}
