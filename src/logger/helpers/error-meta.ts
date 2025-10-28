// src/logger/helpers/error-meta.ts
import { safeSerialize } from './safe-serialize';

export function errorMeta(err?: unknown): Record<string, unknown> | undefined {
  if (!err) return undefined;

  if (err instanceof Error) {
    return {
      name: err.name,
      trace: err.stack,
      // Removed 'message' to avoid overwriting the log entry's message
    };
  }

  return { trace: safeSerialize(err) };
}
