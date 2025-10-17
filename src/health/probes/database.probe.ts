// src/health/probes/database.probe.ts
import { Injectable } from '@nestjs/common';
import { DatabasePrismaService } from '@/database/database-prisma.service';

export interface ProbeResult {
  name: string;
  status: 'up' | 'down';
  message?: string;
}

@Injectable()
export class DatabaseProbe {
  readonly name = 'database';

  constructor(private readonly db: DatabasePrismaService) {}

  async check(): Promise<ProbeResult> {
    try {
      await this.db.$queryRaw`SELECT 1`;
      return { name: this.name, status: 'up' };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return { name: this.name, status: 'down', message };
    }
  }
}
