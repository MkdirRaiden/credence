// __tests__/e2e/health.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from './helpers/test-app';

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
      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.data).toHaveProperty('status', 'up');
      expect(response.body.data.data).toHaveProperty('uptimeMs');
    });

    it('has correct liveness structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.data.status).toBe('up');
      expect(typeof response.body.data.data.uptimeMs).toBe('number');
    });
  });

  describe('GET /health/ready', () => {
    it('returns readiness status', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body).toHaveProperty('data');
    });

    it('includes database health check', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      expect(response.body.data.data.details).toHaveProperty('database');
      expect(response.body.data.data.details.database).toHaveProperty('status');
    });

    it('returns ok when database is healthy', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      expect(response.body.data.data.status).toBe('ok');
      expect(response.body.data.data.details.database.status).toBe('up');
    });
  });

  describe('Health endpoints consistency', () => {
    it('both endpoints return valid health check format', async () => {
      const [liveResponse, readyResponse] = await Promise.all([
        request(app.getHttpServer()).get('/health/live'),
        request(app.getHttpServer()).get('/health/ready'),
      ]);

      // Both should have same wrapper structure
      expect(liveResponse.body).toHaveProperty('success', true);
      expect(liveResponse.body).toHaveProperty('statusCode', 200);
      expect(liveResponse.body).toHaveProperty('data');

      expect(readyResponse.body).toHaveProperty('success', true);
      expect(readyResponse.body).toHaveProperty('statusCode', 200);
      expect(readyResponse.body).toHaveProperty('data');
    });
  });
});
