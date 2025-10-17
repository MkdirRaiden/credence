//src/logger/helpers/error.meta.ts
import { safeSerialize } from '@/logger/helpers/safe.serialize';

export function errorMeta(err?: unknown): Record<string, unknown> | undefined {
  if (!err) return undefined;
  if (err instanceof Error) {
    return { trace: err.stack ?? undefined, name: err.name ?? 'Error' };
  }
  return { trace: safeSerialize(err) };
}
