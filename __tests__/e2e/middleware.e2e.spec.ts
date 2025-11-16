// __tests__/e2e/middleware.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp, closeTestApp } from '../common/test-app';

describe('Global Middleware (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('RequestIdMiddleware', () => {
    it('processes requests successfully', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200);

      const body = response.body.data ?? response.body;

      expect(body).toHaveProperty('status');
    });

    it('accepts x-request-id header', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .set('x-request-id', 'req_test_123')
        .expect(200);

      const body = response.body.data ?? response.body;

      expect(body).toHaveProperty('status');
    });
  });
});
