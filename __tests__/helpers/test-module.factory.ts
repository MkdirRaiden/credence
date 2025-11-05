// __tests__/integration/helpers/test-module.factory.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { LoggerModule } from '@/logger/logger.module';
import { DatabaseModule } from '@/database/database.module';
import { SchedulerService } from '@/health/services';
import { ModuleMetadata } from '@nestjs/common';

/**
 * Creates a test module with core dependencies (Config, Logger, Database).
 * Validates NODE_ENV=test to prevent accidental database mutations.
 */
export async function createTestModule(
  metadata: ModuleMetadata = {},
): Promise<TestingModule> {
  // Check if we're in test env
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Integration tests must run with NODE_ENV=test');
  }

  return Test.createTestingModule({
    imports: [
      ConfigModule,
      LoggerModule,
      DatabaseModule,
      ...(metadata.imports || []),
    ],
    providers: metadata.providers || [],
    controllers: metadata.controllers || [],
  }).compile();
}

/**
 * Closes test application and explicitly stops scheduler.
 * Prevents Jest from hanging due to open handles.
 */
export async function closeTestApp(app: INestApplication): Promise<void> {
  try {
    const scheduler = app.get<SchedulerService>(SchedulerService, {
      strict: false,
    });
    scheduler?.onApplicationShutdown('SIGTERM');
  } catch {
    // Ignore if not available
  }

  try {
    await app.close();
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (err) {
    console.error('Error closing test app:', err);
  }
}
