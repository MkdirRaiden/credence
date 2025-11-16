// __tests__/e2e/auth.e2e.spec.ts
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PrismaService } from '@/database/services';
import { createTestApp, closeTestApp } from '../common/test-app';

describe('Auth flows (E2E)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;

  const testEmail = 'e2e.user@example.com';

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer();
    prisma = app.get(PrismaService);

    // Clean any leftovers from previous runs for this email
    await prisma.refreshToken.deleteMany({
      where: { user: { email: testEmail } },
    });
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  beforeEach(async () => {
    // Avoid any state leakage between tests
    await prisma.refreshToken.deleteMany({});
  });

  it('registers a user and returns AuthResponseDto', async () => {
    const res = await request(server)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: 'Plain123!',
        username: 'e2e_user',
        name: 'E2E User',
      })
      .expect(201);

    const body = res.body.data ?? res.body;
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(body).toHaveProperty('expiresIn');
    expect(body).toHaveProperty('user');
    expect(body.user.email).toBe(testEmail);
  });

  it('logs in with email/password and returns new tokens', async () => {
    const res = await request(server)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'Plain123!',
      })
      .expect(201);

    const body = res.body.data ?? res.body;
    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });

  it('uses access token from login to access /auth/me', async () => {
    // Login to get access token
    const loginRes = await request(server)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'Plain123!',
      })
      .expect(201);

    const loginBody = loginRes.body.data ?? loginRes.body;
    const { accessToken } = loginBody;

    // Call the protected endpoint: GET /api/v1/auth/me
    const meRes = await request(server)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const meBody = meRes.body.data ?? meRes.body;
    expect(meBody.email).toBe(testEmail);
  });
});
