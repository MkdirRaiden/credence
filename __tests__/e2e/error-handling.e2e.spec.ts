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

  it('returns 404 with error structure for non-existent routes', async () => {
    const response = await request(app.getHttpServer())
      .get('/non-existent-route')
      .expect(404)
      .expect('Content-Type', /json/);

    expect(response.body.success).toBe(false);
    expect(response.body.statusCode).toBe(404);
    expect(response.body.message).toContain('Cannot GET');
    expect(response.body.path).toBe('/non-existent-route');
    expect(response.body.timestamp).toBeDefined();
  });

  it('returns 404 for unsupported HTTP methods', async () => {
    await request(app.getHttpServer()).post('/').expect(404);
    await request(app.getHttpServer()).put('/health/live').expect(404);
    await request(app.getHttpServer()).delete('/health/ready').expect(404);
  });
});
