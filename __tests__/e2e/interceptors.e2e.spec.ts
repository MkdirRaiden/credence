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

  describe('ResponseInterceptor (wraps routes)', () => {
    it('wraps responses in StandardResponse envelope for a typical route', async () => {
      const res = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);

      expect(res.body).toHaveProperty('success');
      expect(res.body).toHaveProperty('statusCode');
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('Previously “excluded” routes are also wrapped', () => {
    it('health/live returns wrapped data', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);

      const body = response.body.data ?? response.body;

      expect(body).toHaveProperty('status');
      expect(response.body.success).toBe(true);
    });

    it('root returns wrapped config', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);

      const body = response.body.data ?? response.body;

      expect(body).toHaveProperty('name');
      expect(response.body.success).toBe(true);
    });
  });
});
