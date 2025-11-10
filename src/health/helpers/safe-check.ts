// src/health/helpers/safe-check.ts
import { ProbeResult } from '@/health/health.interface';

export async function safeCheck(
  name: string,
  checkFn: () => Promise<void>,
): Promise<ProbeResult> {
  try {
    await checkFn();
    return { name, status: 'up' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { name, status: 'down', message };
  }
}
