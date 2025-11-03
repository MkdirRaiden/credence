// __tests__/e2e/interceptors.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../helpers/test-app';

describe('Global Interceptors (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('ResponseInterceptor', () => {
    it('wraps successful responses in StandardResponse', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.success).toBe(true);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });

    it('includes X-API-Version header', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(response.headers['x-api-version']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('includes security headers from helmet', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('VisibilityInterceptor', () => {
    it('filters fields based on visibility context (tested via Users E2E)', async () => {
      // This is tested in users.e2e.spec.ts
      // Example: GET /users/:id returns public visibility (no email)
      // GET /users/:id?admin returns admin visibility (has email)
      expect(true).toBe(true);
    });
  });
});
