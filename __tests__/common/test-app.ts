// __tests__/common/test-app.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';


let testModule: TestingModule;


export async function createTestApp(): Promise<INestApplication> {
  testModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = testModule.createNestApplication();
  await app.init();

  return app;
}


export async function closeTestApp(app: INestApplication): Promise<void> {
  // Close app
  await app.close();

  // Close test module (closes all providers)
  await testModule.close();

  // Force close remaining handles
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
