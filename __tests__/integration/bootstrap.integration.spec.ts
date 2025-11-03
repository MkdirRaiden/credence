// __tests__/integration/bootstrap.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { createTestModule } from './__helpers__/test-module.factory';

jest.setTimeout(30000);

describe('Bootstrap Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await createTestModule();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('initializes application successfully', () => {
    expect(app).toBeDefined();
    expect(app.get).toBeDefined();
  });

  it('has http server configured', () => {
    expect(app.getHttpServer()).toBeDefined();
  });

  it('application ready for requests', async () => {
    // If we got here without errors, bootstrap was successful
    expect(app.getHttpServer()).toBeDefined();
  });
});
