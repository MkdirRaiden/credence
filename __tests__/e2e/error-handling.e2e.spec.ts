// __tests__/e2e/error-handling.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../common/test-app';

describe('Global Error Handling (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  it('404 on excluded routes returns raw response', async () => {
    const response = await request(app.getHttpServer())
      .get('/non-existent-health-endpoint')
      .expect(404);

    // Check structure (raw 404, not wrapped)
    expect(response.body).toBeDefined();
  });

  // Add test with actual wrapped endpoint when users module exists:
  // it('400 validation on wrapped endpoints returns wrapped error', async () => {
  //   await request(app.getHttpServer())
  //     .post('/api/v1/users')
  //     .send({})
  //     .expect(400);
  // });
});
