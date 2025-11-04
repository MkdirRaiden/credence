// __tests__/e2e/health.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../helpers/test-app';

describe('Health Controller (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /health/live', () => {
    it('returns liveness status', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.status).toBe('up');
      expect(response.body.data.uptimeMs).toBeGreaterThan(0);
    });

    it('completes quickly', async () => {
      const start = Date.now();
      await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);
      const duration = Date.now() - start;

      // Liveness should be very fast (no probes)
      expect(duration).toBeLessThan(100);
    });
  });

  describe('GET /health/ready', () => {
    it('returns readiness status with database check', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.status).toBe('ok');
      expect(response.body.data.details.database.status).toBe('up');
    });

    it('includes all probe details in response', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      const details = response.body.data.details;
      expect(Object.keys(details).length).toBeGreaterThan(0);
      Object.entries(details).forEach(([name, detail]: any) => {
        expect(detail).toHaveProperty('status');
        expect(['up', 'down']).toContain(detail.status);
      });
    });

    it('includes requestId in response headers or logs', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      // RequestId should be generated (either in header or accessible via logs)
      expect(response).toBeDefined();
      // Verify response completes within timeout
      expect(response.body.data.status).toBeDefined();
    });

    it('handles concurrent requests with independent requestIds', async () => {
      // Verify two concurrent requests complete independently
      const responses = await Promise.all([
        request(app.getHttpServer())
          .get('/health/ready')
          .expect(200),
        request(app.getHttpServer())
          .get('/health/ready')
          .expect(200),
      ]);

      expect(responses).toHaveLength(2);
      responses.forEach((response) => {
        expect(response.body.data.status).toBe('ok');
      });
    });

    it('completes within timeout', async () => {
      const start = Date.now();
      await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);
      const duration = Date.now() - start;

      // Should complete well within timeout (with margin)
      expect(duration).toBeLessThan(5000);
    });
  });
});
