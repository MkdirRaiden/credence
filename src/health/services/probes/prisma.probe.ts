// src/health/services/probes/prisma.probe.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/services';
import * as helpers from '@/health/helpers';
import { Probe, ProbeResult } from '@/health/health.interface';

@Injectable()
export class PrismaProbeService implements Probe {
  readonly name = 'database';

  constructor(private readonly db: PrismaService) {}

  async check(options?: { timeout?: number }): Promise<ProbeResult> {
    return helpers.safeCheck(this.name, async () => {
      const query = this.db.$queryRaw`SELECT 1`;

      if (options?.timeout) {
        await helpers.withTimeout(query, options.timeout);
      } else {
        await query;
      }
    });
  }
}
