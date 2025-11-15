// src/logger/helpers/formatting/error-meta.ts
import { safeSerialize } from '@/logger/helpers';

/**
 * Extracts error metadata (name, trace) without message.
 * Excludes message to prevent overwriting log entry message via Object.assign.
 */
export function errorMeta(err?: unknown): Record<string, unknown> | undefined {
  if (!err) return undefined;

  if (err instanceof Error) {
    return {
      name: err.name,
      trace: err.stack,
    };
  }

  return { trace: safeSerialize(err) };
}
