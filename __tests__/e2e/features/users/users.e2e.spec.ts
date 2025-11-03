// __tests__/e2e/features/users/users.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import request from 'supertest';
import { createTestApp, closeTestApp } from '../../../helpers/test-app';
import { cleanupDatabase } from '../../../helpers/test-database';
import { GLOBAL_PREFIX } from '@/common/constants';

describe('Users E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const API_PREFIX = `/${GLOBAL_PREFIX}`;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await cleanupDatabase(prisma);
    await closeTestApp(app);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('Public Routes', () => {
    describe('GET /api/v1/users/:id', () => {
      it('returns user with public visibility', async () => {
        const user = await prisma.user.create({
          data: { email: 'test@example.com', name: 'Test' },
        });

        const response = await request(app.getHttpServer())
          .get(`${API_PREFIX}/users/id/${user.id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Test');
        expect(response.body.data.email).toBeUndefined();
      });

      it('rejects invalid UUID', async () => {
        const response = await request(app.getHttpServer())
          .get(`${API_PREFIX}/users/id/invalid-id`)
          .expect(400);

        expect(response.body.success).toBe(false);
      });

      it('returns 404 for non-existent user', async () => {
        const response = await request(app.getHttpServer())
          .get(`${API_PREFIX}/users/id/550e8400-e29b-41d4-a716-446655440000`)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.statusCode).toBe(404);
      });
    });

    describe('GET /api/v1/users', () => {
      it('returns paginated users', async () => {
        await prisma.user.createMany({
          data: [
            { email: 'user1@example.com', name: 'User 1' },
            { email: 'user2@example.com', name: 'User 2' },
          ],
        });

        const response = await request(app.getHttpServer())
          .get(`${API_PREFIX}/users?skip=0&take=10`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      it('respects pagination', async () => {
        await prisma.user.createMany({
          data: [
            { email: 'user1@example.com' },
            { email: 'user2@example.com' },
            { email: 'user3@example.com' },
          ],
        });

        const response = await request(app.getHttpServer())
          .get(`${API_PREFIX}/users?skip=1&take=1`)
          .expect(200);

        expect(response.body.data).toHaveLength(1);
      });
    });
  });

  describe('Protected Routes (JWT Required)', () => {
    describe('POST /api/v1/users', () => {
      it('rejects without JWT', async () => {
        const response = await request(app.getHttpServer())
          .post(`${API_PREFIX}/users`)
          .send({ email: 'test@example.com', name: 'Test User' })
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });

    describe('PUT /api/v1/users/:id', () => {
      it('rejects without JWT', async () => {
        const user = await prisma.user.create({
          data: { email: 'test@example.com' },
        });

        const response = await request(app.getHttpServer())
          .put(`${API_PREFIX}/users/${user.id}`)
          .send({ name: 'Updated' })
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });

    describe('DELETE /api/v1/users/:id', () => {
      it('rejects without JWT', async () => {
        const user = await prisma.user.create({
          data: { email: 'test@example.com' },
        });

        const response = await request(app.getHttpServer())
          .delete(`${API_PREFIX}/users/${user.id}`)
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Decorators', () => {
    describe('@GetVisibilityContext decorator', () => {
      it('filters fields based on visibility context', async () => {
        const user = await prisma.user.create({
          data: { email: 'test@example.com', name: 'Test' },
        });

        const response = await request(app.getHttpServer())
          .get(`${API_PREFIX}/users/id/${user.id}`)
          .expect(200);

        expect(response.body.data.email).toBeUndefined();
        expect(response.body.data.name).toBe('Test');
      });
    });
  });
});
