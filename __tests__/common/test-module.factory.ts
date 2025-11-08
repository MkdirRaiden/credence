// __tests__/common/test-module.factory.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@/config/config.module';
import { LoggerModule } from '@/logger/logger.module';
import { DatabaseModule } from '@/database/database.module';
import { ModuleMetadata } from '@nestjs/common';

/**
 * Creates a test module with core dependencies (Config, Logger, Database).
 * Validates NODE_ENV=test to prevent accidental database mutations.
 */
export async function createTestModule(
  metadata: ModuleMetadata = {},
): Promise<TestingModule> {
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
