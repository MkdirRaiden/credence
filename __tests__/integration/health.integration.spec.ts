// __tests__/integration/health.integration.spec.ts
import { HealthService } from '@/health/health.service';
import { HealthModule } from '@/health/health.module';
import { createTestModule } from './__helpers__/test-module.factory';
import { disconnectDatabase } from './__helpers__/test-database';
import { PrismaService } from '@/database/prisma.service';

jest.setTimeout(20000);

describe('HealthService (Integration)', () => {
  let healthService: HealthService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await createTestModule({ imports: [HealthModule] });
    healthService = moduleRef.get(HealthService);
    prismaService = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await disconnectDatabase(prismaService);
  });

  it('passes readiness check with connected database', async () => {
    await expect(healthService.assertReadiness()).resolves.not.toThrow();
  });

  it('returns liveness with uptime', () => {
    const result = healthService.liveness();

    expect(result.status).toBe('up');
    expect(result.uptimeMs).toBeGreaterThan(0);
  });

  it('returns readiness with database status', async () => {
    const result = await healthService.readinessOrThrow();

    expect(result.status).toBe('ok');
    expect(result.details.database.status).toBe('up');
  });
});
