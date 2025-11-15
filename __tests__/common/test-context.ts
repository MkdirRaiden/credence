// __tests__/common/test-context.ts
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/database/services';
import { SchedulerService } from '@/health/services';
import { createTestModule } from './test-module.factory';
import { cleanupDatabase } from './test-database';
import { ModuleMetadata } from '@nestjs/common';

/**
 * Unified test context — handles app setup, DB cleanup, teardown.
 * Reduces boilerplate significantly.
 */
export class TestContext {
  private moduleRef: TestingModule | undefined;
  app: INestApplication | undefined;
  prisma: PrismaService | undefined;

  async setup(metadata: ModuleMetadata = {}): Promise<void> {
    this.moduleRef = await createTestModule(metadata);
    this.app = this.moduleRef.createNestApplication();
    await this.app.init();
    this.prisma = this.moduleRef.get(PrismaService);
  }

  async teardown(): Promise<void> {
    try {
      // Cleanup DB
      await cleanupDatabase(this.prisma);

      // Stop scheduler
      if (this.app) {
        try {
          const scheduler = this.app.get<SchedulerService>(SchedulerService, {
            strict: false,
          });
          scheduler?.onApplicationShutdown('SIGTERM');
        } catch {
          // Ignore if not available
        }

        // Close app
        await this.app.close();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (err) {
      console.error('Error closing test app:', err);
    } finally {
      this.app = undefined;
      this.moduleRef = undefined;
      this.prisma = undefined;
    }
  }

  /**
   * Get service instance from module
   */
  getService<T>(token: any): T {
    if (!this.moduleRef) {
      throw new Error('TestContext not initialized. Call setup() first.');
    }
    return this.moduleRef.get<T>(token);
  }
}
