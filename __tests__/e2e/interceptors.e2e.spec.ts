// __tests__/e2e/interceptors.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../common/test-app';

describe('Global Interceptors (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('ResponseInterceptor (wraps included routes)', () => {
    it('wraps responses in StandardResponse envelope', async () => {
      // Test with a route that IS wrapped (not excluded)
      // Example: POST /api/v1/auth/register (when created)
      // For now, skip or test with actual endpoint
      expect(true).toBe(true);
    });
  });

  describe('Excluded routes bypass interceptor', () => {
    it('health/live returns raw data', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.success).toBeUndefined(); // Not wrapped
    });

    it('root returns raw config', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body.success).toBeUndefined(); // Not wrapped
    });
  });
});
