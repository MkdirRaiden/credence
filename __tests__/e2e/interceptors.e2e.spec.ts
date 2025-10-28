// __tests__/e2e/interceptors.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; 
import { createTestApp, closeTestApp } from './helpers/test-app';

describe('Global Interceptors (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('Response Transformation', () => {
    it('applies response transformation to root endpoint', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      // Verify response is properly formatted
      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    });

    it('maintains JSON content type', async () => {
      await request(app.getHttpServer())
        .get('/')
        .expect('Content-Type', /json/);

      await request(app.getHttpServer())
        .get('/health/live')
        .expect('Content-Type', /json/);
    });
  });

  describe('Response Headers', () => {
    it('includes security headers from helmet', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      // Helmet adds these security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });
});
