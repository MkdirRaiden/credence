// __tests__/e2e/helpers/test-app.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { Bootstrap } from '@/bootstrap/bootstrap';

/**
 * Creates a fully configured test application instance
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Apply same bootstrap configuration as production
  Bootstrap.init(app);

  await app.init();
  return app;
}

/**
 * Closes test application and cleans up resources
 */
export async function closeTestApp(app: INestApplication): Promise<void> {
  await app.close();
}
