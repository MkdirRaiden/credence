// __tests__/e2e/error-handling.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from './helpers/test-app';

describe('Global Error Handling (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('404 Not Found', () => {
    it('returns 404 for non-existent routes', async () => {
      const response = await request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('path', '/non-existent-route');
    });

    it('has consistent error structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/invalid/endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toContain('Cannot GET');
    });
  });

  describe('Method Not Allowed', () => {
    it('returns 404 for unsupported HTTP methods', async () => {
      await request(app.getHttpServer())
        .post('/')
        .expect(404);

      await request(app.getHttpServer())
        .put('/health/live')
        .expect(404);

      await request(app.getHttpServer())
        .delete('/health/ready')
        .expect(404);
    });
  });
});
