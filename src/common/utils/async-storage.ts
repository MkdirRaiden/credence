// src/common/utils/async-storage.ts
import { AsyncLocalStorage } from 'async_hooks';

export const requestContext = new AsyncLocalStorage<{
  requestId?: string;
}>();
