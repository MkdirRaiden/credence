// src/health/services/probes/prisma.probe.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { createTimeoutPromise } from '@/health/helpers';
import { Probe, ProbeResult } from '@/health/health.interface';

/**
 * Health probe for database connectivity via Prisma.
 */
@Injectable()
export class PrismaProbeService implements Probe {
  readonly name = 'database';

  constructor(private readonly db: PrismaService) {}

  async check(options?: { timeout?: number }): Promise<ProbeResult> {
    try {
      const timeoutMs = options?.timeout;

      if (timeoutMs) {
        const timeoutHandle = createTimeoutPromise(timeoutMs);
        try {
          await Promise.race([
            this.db.$queryRaw`SELECT 1`,
            timeoutHandle.promise,
          ]);
        } finally {
          clearTimeout(timeoutHandle.id);
        }
      } else {
        await this.db.$queryRaw`SELECT 1`;
      }

      return { name: this.name, status: 'up' };
    } catch (err: unknown) {
      const message = this.extractErrorMessage(err);
      return { name: this.name, status: 'down', message };
    }
  }

  private extractErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : 'Unknown error';
  }
}
