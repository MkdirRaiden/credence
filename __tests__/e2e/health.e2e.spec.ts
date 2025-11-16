// __tests__/e2e/health.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp, closeTestApp } from '../common/test-app';

describe('Health Controller (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /health/live', () => {
    it('returns liveness status (wrapped)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200)
        .expect('Content-Type', /json/);

      const body = response.body.data ?? response.body;

      expect(body).toHaveProperty('status');
      expect(body.status).toBe('up');
      expect(body).toHaveProperty('uptimeMs');
    });

    it('completes quickly (no heavy probes)', async () => {
      const start = Date.now();
      await request(app.getHttpServer()).get('/health/live').expect(200);
      const duration = Date.now() - start;

      // E2E timing can vary --- allow some margin
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('GET /health/ready', () => {
    it('returns readiness status (wrapped)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      const body = response.body.data ?? response.body;

      expect(body).toHaveProperty('status');
      expect(body.status).toBe('ok');
      expect(body).toHaveProperty('details');
    });

    it('includes database probe', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      const body = response.body.data ?? response.body;

      expect(body.details).toHaveProperty('database');
      expect(body.details.database).toHaveProperty('status');
    });
  });
});
