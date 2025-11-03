// src/health/probes/prisma.probe.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { Probe, ProbeResult } from '@/health/health.interface';

/**
 * Health probe for database connectivity via Prisma.
 */
@Injectable()
export class PrismaProbe implements Probe {
  readonly name = 'database';

  constructor(private readonly db: PrismaService) {}

  async check(options?: { timeout?: number }): Promise<ProbeResult> {
    try {
      const timeoutMs = options?.timeout;

      if (timeoutMs) {
        // Periodic check: use timeout for K8s liveness probe
        await Promise.race([
          this.db.$queryRaw`SELECT 1`,
          this.timeoutPromise(timeoutMs),
        ]);
      } else {
        // Bootstrap check: patient wait (no timeout)
        await this.db.$queryRaw`SELECT 1`;
      }

      return { name: this.name, status: 'up' };
    } catch (err: unknown) {
      const message = this.extractErrorMessage(err);
      return { name: this.name, status: 'down', message };
    }
  }

  private timeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Probe timeout')),
        timeoutMs,
      ),
    );
  }

  private extractErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Unknown error';
  }
}
