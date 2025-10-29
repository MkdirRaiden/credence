// __tests__/e2e/features/users.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '@/database/prisma.service';
import { createTestApp, closeTestApp } from '../helpers/test-app';

describe('Users API (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const baseUrl = '/api/v1/users';

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await closeTestApp(app);
  });

  it('creates and retrieves user', async () => {
    const created = await request(app.getHttpServer())
      .post(baseUrl)
      .send({
        email: 'test@example.com',
        phone: '+1234567890',
        name: 'John Doe',
      })
      .expect(201);

    expect(created.body.success).toBe(true);
    expect(created.body.data.email).toBe('test@example.com');
    expect(created.body.data.passwordHash).toBeUndefined();

    const userId = created.body.data.id;

    const byId = await request(app.getHttpServer())
      .get(`${baseUrl}/id/${userId}`)
      .expect(200);
    expect(byId.body.data.email).toBe('test@example.com');

    const byEmail = await request(app.getHttpServer())
      .get(`${baseUrl}/email/test@example.com`)
      .expect(200);
    expect(byEmail.body.data.id).toBe(userId);
  });

  it('lists users with pagination', async () => {
    await prisma.user.createMany({
      data: [
        { email: 'user1@example.com' },
        { email: 'user2@example.com' },
        { email: 'user3@example.com' },
      ],
    });

    const all = await request(app.getHttpServer())
      .get(baseUrl)
      .expect(200);
    expect(all.body.data).toHaveLength(3);

    const paginated = await request(app.getHttpServer())
      .get(`${baseUrl}?skip=1&take=1`)
      .expect(200);
    expect(paginated.body.data).toHaveLength(1);
  });

  it('updates and soft deletes user', async () => {
    const user = await prisma.user.create({
      data: { email: 'update@example.com' },
    });

    const updated = await request(app.getHttpServer())
      .put(`${baseUrl}/${user.id}`)
      .send({ name: 'Updated Name' })
      .expect(200);
    expect(updated.body.data.name).toBe('Updated Name');

    await request(app.getHttpServer())
      .delete(`${baseUrl}/${user.id}`)
      .expect(200);

    // Verify exclusion from list
    const list = await request(app.getHttpServer())
      .get(baseUrl)
      .expect(200);
    expect(list.body.data).toHaveLength(0);

    // Verify in database
    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(deletedUser?.deletedAt).not.toBeNull();
  });

  it('validates input and returns 404 for missing resources', async () => {
    const validationError = await request(app.getHttpServer())
      .post(baseUrl)
      .send({ email: 'invalid-email' })
      .expect(400);

    expect(validationError.body.success).toBe(false);
    expect(validationError.body.statusCode).toBe(400);

    const notFoundError = await request(app.getHttpServer())
      .get(`${baseUrl}/id/00000000-0000-0000-0000-000000000000`)
      .expect(404);

    expect(notFoundError.body.success).toBe(false);
    expect(notFoundError.body.statusCode).toBe(404);
  });
});
