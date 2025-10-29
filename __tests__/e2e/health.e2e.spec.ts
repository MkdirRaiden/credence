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

  it('GET /health/live returns liveness status', async () => {
    const response = await request(app.getHttpServer())
      .get('/health/live')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('up');
    expect(response.body.data.uptimeMs).toBeGreaterThan(0);
  });

  it('GET /health/ready and /health return database readiness', async () => {
    const ready = await request(app.getHttpServer())
      .get('/health/ready')
      .expect(200);

    expect(ready.body.success).toBe(true);
    expect(ready.body.data.status).toBe('ok');
    expect(ready.body.data.details.database.status).toBe('up');

    const health = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    expect(health.body.data.status).toBe('ok');
  });
});
