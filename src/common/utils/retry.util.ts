// src/common/utils/retry.util.ts
import { DATABASE_MAX_RETRIES, DATABASE_RETRY_DELAY } from '../constants';

export interface RetryOptions {
  retries?: number;
  delay?: number;
  context?: string; // optional operation name for observability
}

export async function retry<T>(
  operation: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const retries = options?.retries ?? DATABASE_MAX_RETRIES;
  const delay = options?.delay ?? DATABASE_RETRY_DELAY;
  const context = options?.context ?? 'Operation';

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (err: any) {
      if (attempt === retries) {
        // All retries exhausted, propagate original error
        throw err;
      }
      // Optionally log to console for observability
      console.warn(
        `[${context}] Retry attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  // TypeScript fallback (should never reach)
  throw new Error('Unexpected retry logic exit');
}
