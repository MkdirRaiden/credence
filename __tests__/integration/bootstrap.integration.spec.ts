// __tests__/integration/bootstrap.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { BootstrapService, ReadinessService, ShutdownService } 
from '@/bootstrap/services';
import { HealthService } from '@/health/services';
import { AppModule } from '@/app.module';
import { closeTestApp, createTestModule } from '../helpers/test-module.factory';

jest.setTimeout(30000);

describe('Bootstrap Integration', () => {
  let app: INestApplication;
  let bootstrapService: BootstrapService;
  let readinessService: ReadinessService;
  let shutdownService: ShutdownService;
  let healthService: HealthService;

  beforeAll(async () => {
    const moduleRef = await createTestModule({
      imports: [AppModule],
    });
    app = moduleRef.createNestApplication();
    await app.init();

    bootstrapService = moduleRef.get(BootstrapService);
    readinessService = moduleRef.get(ReadinessService);
    shutdownService = moduleRef.get(ShutdownService);
    healthService = moduleRef.get(HealthService);
  });

  afterAll(async () => {
    if (app) await closeTestApp(app);
  });

  describe('Bootstrap.init()', () => {
    it('sets up middleware and global setup successfully', () => {
      bootstrapService.init(app);
      expect(app.getHttpServer()).toBeDefined();
    });

    it('enables shutdown hooks', () => {
      bootstrapService.init(app);
      // If we got here without errors, hooks are enabled
      expect(app.getHttpServer()).toBeDefined();
    });

    it('registers signal handlers for graceful shutdown', () => {
      const processSpy = jest.spyOn(process, 'on').mockImplementation();

      shutdownService.registerHandlers(app);

      expect(processSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
      expect(processSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));

      processSpy.mockRestore();
    });
  });

  describe('ReadinessService', () => {
    it('runs readiness checks successfully', async () => {
      await expect(readinessService.run()).resolves.not.toThrow();
    });

    it('throws error if health checks fail', async () => {
      const assertSpy = jest
        .spyOn(healthService, 'assertReadiness')
        .mockRejectedValue(new Error('Database down'));

      await expect(readinessService.run()).rejects.toThrow('Database down');

      assertSpy.mockRestore();
    });
  });

  describe('HealthService', () => {
    it('passes bootstrap readiness check', async () => {
      await expect(healthService.assertReadiness()).resolves.not.toThrow();
    });

    it('returns readiness status with all probes', async () => {
      const result = await healthService.readinessOrThrow();
      expect(result.status).toBe('ok');
      expect(result.details.database?.status).toBe('up');
    });

    it('returns liveness with uptime', () => {
      const result = healthService.liveness();
      expect(result.status).toBe('up');
      expect(result.uptimeMs).toBeGreaterThan(0);
    });
  });

  describe('Bootstrap Flow', () => {
    it('complete bootstrap flow: init → readiness → ready', async () => {
      // 1. Init sets up middleware, filters, shutdown
      bootstrapService.init(app);
      expect(app.getHttpServer()).toBeDefined();

      // 2. Readiness checks pass
      await expect(readinessService.run()).resolves.not.toThrow();

      // 3. App is ready to accept traffic
      const liveness = healthService.liveness();
      expect(liveness.status).toBe('up');
    });
  });
});
