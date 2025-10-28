// src/common/utils/retry-database.ts
import { LoggerService } from '@/logger/logger.service';

export async function retry<T>(
  operation: () => Promise<T> | T,
  options: {
    retries: number;
    delay: number;
    context?: string;
    delayFn?: (ms: number) => Promise<void>;
    logger?: LoggerService;
  },
): Promise<T> {
  const { retries, delay, context, delayFn, logger } = options;

  const wait =
    delayFn || ((ms: number) => new Promise((res) => setTimeout(res, ms)));

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (err: unknown) {
      lastError = err;

      if (attempt < retries) {
        if (context) {
          logger?.warn(
            `[${context}] Retry attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
          );
        }
        await wait(delay);
      }
    }
  }

  throw lastError;
}
