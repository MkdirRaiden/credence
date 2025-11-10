// src/health/helpers/with-timeout.ts
export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`Timeout after ${timeoutMs}ms`)),
      timeoutMs,
    );
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}
