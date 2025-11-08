// src/common/utils/extract-resource-id.ts
import type { Request } from 'express';

export function extractResourceId(request: Request): string | undefined {
  if (typeof request.params?.id === 'string') {
    return request.params.id;
  }

  if (typeof request.query?.userId === 'string') {
    return request.query.userId;
  }

  return undefined;
}
