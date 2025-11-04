// __tests__/e2e/helpers/test-app.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { BootstrapService } from '@/bootstrap/bootstrap.service';
import { HealthScheduler } from '@/health/health.scheduler';

/**
 * Creates a fully configured test application instance
 * with all middleware, modules, and services initialized.
 */
export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Get BootstrapService instance and initialize
  const bootstrapService = app.get(BootstrapService);
  bootstrapService.init(app);

  await app.init();
  return app;
}

/**
 * Closes test application and cleans up resources.
 * Explicitly stops scheduler to prevent hanging Jest process.
 */
export async function closeTestApp(app: INestApplication): Promise<void> {
  try {
    // Explicitly trigger scheduler shutdown
    const scheduler = app.get<HealthScheduler>(HealthScheduler, {
      strict: false,
    });
    if (scheduler) {
      scheduler.onApplicationShutdown('SIGTERM');
    }

    // Close app and wait for cleanup
    await app.close();

    // Give async operations time to complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (err) {
    console.error('Error closing test app:', err);
  }
}
