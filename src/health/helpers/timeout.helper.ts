// src/health/helpers/timeout.helper.ts
export function createTimeoutPromise(timeoutMs: number): {
  id: NodeJS.Timeout;
  promise: Promise<never>;
} {
  let timeoutId: NodeJS.Timeout;

  const promise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`Timeout after ${timeoutMs}ms`)),
      timeoutMs,
    );
  });

  return { id: timeoutId!, promise };
}
