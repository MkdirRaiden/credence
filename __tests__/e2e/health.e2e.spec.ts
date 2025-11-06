// __tests__/e2e/health.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../common/test-app';


// __tests__/e2e/health.e2e.spec.ts
describe('Health Controller (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /health/live', () => {
    it('returns raw liveness status (not wrapped)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/live')
        .expect(200)
        .expect('Content-Type', /json/);

      // Excluded routes return RAW response (no wrapper)
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('up');
      expect(response.body).toHaveProperty('uptimeMs');
    });

  it('completes quickly (no probes)', async () => {
    const start = Date.now();
    await request(app.getHttpServer())
      .get('/health/live')
      .expect(200);
    const duration = Date.now() - start;

    // E2E timing can vary — allow 500ms margin
    expect(duration).toBeLessThan(500);
  });
  });

  describe('GET /health/ready', () => {
    it('returns raw readiness status (not wrapped)', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      // Excluded routes return RAW response
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('details');
    });

    it('includes database probe', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/ready')
        .expect(200);

      expect(response.body.details).toHaveProperty('database');
      expect(response.body.details.database).toHaveProperty('status');
    });
  });
});

