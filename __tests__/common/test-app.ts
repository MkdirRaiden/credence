// __tests__/common/test-app.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { BootstrapService } from '@/bootstrap/services';

let testModule: TestingModule;

export async function createTestApp(): Promise<INestApplication> {
  testModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = testModule.createNestApplication();

  // Run the same bootstrap init as main.ts so globalPrefix, middleware,
  // pipes, filters, and interceptors are configured.
  const bootstrap = app.get(BootstrapService);
  bootstrap.init(app);

  await app.init();
  return app;
}

export async function closeTestApp(app: INestApplication): Promise<void> {
  await app.close();
  await testModule.close();

  const handles = (process as any)._getActiveHandles?.();
  const requests = (process as any)._getActiveRequests?.();

  if (handles?.length) {
    handles.forEach((handle: any) => {
      if (handle._close) handle._close();
      if (handle.close) handle.close();
    });
  }

  if (requests?.length) {
    requests.forEach((req: any) => {
      if (req.abort) req.abort();
    });
  }
}
