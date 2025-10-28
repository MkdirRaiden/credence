// src/health/probes/prisma.probe.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

export interface ProbeResult {
  name: string;
  status: 'up' | 'down';
  message?: string;
}

@Injectable()
export class PrismaProbe {
  readonly name = 'prisma';

  constructor(private readonly db: PrismaService) {}

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
