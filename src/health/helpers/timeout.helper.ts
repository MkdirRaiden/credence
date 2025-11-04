// src/health/helpers/timeout.helper.ts
/**
 * Creates a timeout promise that can be cleared.
 * Used to prevent Jest open handles in tests.
 */
export function createTimeoutPromise(timeoutMs: number): {
  id: NodeJS.Timeout;
  promise: Promise<never>;
} {
  let id: NodeJS.Timeout;
  const promise = new Promise<never>((_, reject) => {
    id = setTimeout(
      () => reject(new Error(`Timeout after ${timeoutMs}ms`)),
      timeoutMs,
    );
  });
  return { id: id!, promise };
}
