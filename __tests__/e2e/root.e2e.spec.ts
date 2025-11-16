// __tests__/e2e/root.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp, closeTestApp } from '../common/test-app';

jest.setTimeout(30000);

describe('Root Controller (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  describe('GET /', () => {
    it('returns API info (wrapped)', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/);

      const body = response.body.data ?? response.body;

      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('version');
      expect(body).toHaveProperty('environment');
      expect(body.environment).toBe('test');
    });

    it('does not include config info on top-level data', async () => {
      const response = await request(app.getHttpServer()).get('/').expect(200);

      const body = response.body.data ?? response.body;
      expect(body).not.toHaveProperty('config');
    });
  });
});
