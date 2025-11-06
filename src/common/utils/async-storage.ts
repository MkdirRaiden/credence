// src/common/utils/async-storage.ts
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Request-scoped context storage.
 * Preserves requestId across entire async request chain.
 */
export const requestContext = new AsyncLocalStorage<{
  requestId?: string;
}>();
