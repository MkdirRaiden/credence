// src/logger/helpers/error-meta.ts
import { safeSerialize } from './safe-serialize';

/** Generate metadata for errors */
export function errorMeta(err?: unknown): Record<string, unknown> | undefined {
  if (!err) return undefined;
  if (err instanceof Error) return { trace: err.stack, name: err.name ?? 'Error' };
  return { trace: safeSerialize(err) };
}
