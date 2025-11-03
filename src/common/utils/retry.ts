// src/common/utils/retry-database.ts
import { LoggerService } from '@/logger/logger.service';

export interface RetryOptions {
  retries: number;
  delay: number;
  context?: string;
  exponentialBackoff?: boolean;
  delayFn?: (ms: number) => Promise<void>;
  logger?: LoggerService;
}

/**
 * Retries operation with optional exponential backoff and logging.
 */
export async function retry<T>(
  operation: () => Promise<T> | T,
  options: RetryOptions,
): Promise<T> {
  const {
    retries,
    delay,
    context,
    exponentialBackoff = false,
    delayFn,
    logger,
  } = options;

  const wait =
    delayFn || ((ms: number) => new Promise((res) => setTimeout(res, ms)));

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (err: unknown) {
      lastError = err;

      if (attempt < retries) {
        // Exponential backoff: delay * 2^attempt
        const nextDelay = exponentialBackoff
          ? delay * Math.pow(2, attempt)
          : delay;

        if (context) {
          logger?.warn(
            `[${context}] Retry attempt ${attempt + 1}/${retries} failed. Retrying in ${nextDelay}ms...`,
            'Retry',
          );
        }

        await wait(nextDelay);
      }
    }
  }

  throw lastError;
}
