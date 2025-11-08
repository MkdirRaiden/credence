// __tests__/e2e/root.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../common/test-app';

describe('Root Controller (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /', () => {
    it('returns raw API info (not wrapped)', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body.environment).toBe('test');
    });

    it('does not include config info', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);

      expect(response.body).not.toHaveProperty('config');
    });
  });
});
