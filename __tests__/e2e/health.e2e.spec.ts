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
      expect(response.body.data).toHaveProperty('status', 'up');
      expect(response.body.data).toHaveProperty('uptimeMs');
    });

    it('has correct liveness structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.status).toBe('up');
      expect(typeof response.body.data.uptimeMs).toBe('number');
      expect(response.body.data.uptimeMs).toBeGreaterThan(0);
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
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('details');
    });

    it('includes database health check', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      expect(response.body.data.details).toHaveProperty('database');
      expect(response.body.data.details.database).toHaveProperty('status');
    });

    it('returns ok when database is healthy', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      expect(response.body.data.status).toBe('ok');
      expect(response.body.data.details.database.status).toBe('up');
    });
  });

  describe('GET /health', () => {
    it('returns readiness status as default health check', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('statusCode', 200);
      expect(response.body.data).toHaveProperty('status', 'ok');
      expect(response.body.data.details).toHaveProperty('database');
    });

    it('matches /health/ready response structure', async () => {
      const [healthResponse, readyResponse] = await Promise.all([
        request(app.getHttpServer()).get('/health'),
        request(app.getHttpServer()).get('/health/ready'),
      ]);

      expect(healthResponse.body.data.status).toBe(readyResponse.body.data.status);
      expect(healthResponse.body.data.details).toEqual(readyResponse.body.data.details);
    });
  });

  describe('Health endpoints consistency', () => {
    it('all endpoints return valid health check format', async () => {
      const [liveResponse, readyResponse, healthResponse] = await Promise.all([
        request(app.getHttpServer()).get('/health/live'),
        request(app.getHttpServer()).get('/health/ready'),
        request(app.getHttpServer()).get('/health'),
      ]);

      // All should have same wrapper structure
      expect(liveResponse.body).toHaveProperty('success', true);
      expect(liveResponse.body).toHaveProperty('statusCode', 200);
      expect(liveResponse.body).toHaveProperty('data');
      expect(liveResponse.body).toHaveProperty('timestamp');
      expect(liveResponse.body).toHaveProperty('path', '/health/live');

      expect(readyResponse.body).toHaveProperty('success', true);
      expect(readyResponse.body).toHaveProperty('statusCode', 200);
      expect(readyResponse.body).toHaveProperty('data');
      expect(readyResponse.body).toHaveProperty('timestamp');
      expect(readyResponse.body).toHaveProperty('path', '/health/ready');

      expect(healthResponse.body).toHaveProperty('success', true);
      expect(healthResponse.body).toHaveProperty('statusCode', 200);
      expect(healthResponse.body).toHaveProperty('data');
      expect(healthResponse.body).toHaveProperty('timestamp');
      expect(healthResponse.body).toHaveProperty('path', '/health');
    });
  });
});
