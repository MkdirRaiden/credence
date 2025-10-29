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

  it('applies response transformation with JSON content type', async () => {
    const rootResponse = await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rootResponse.body).toBeDefined();
    expect(rootResponse.body.success).toBe(true);

    await request(app.getHttpServer())
      .get('/health/live')
      .expect('Content-Type', /json/);
  });

  it('includes security headers from helmet', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .expect(200);

    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
});
