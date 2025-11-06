// __tests__/integration/config.integration.spec.ts
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@/common/interfaces';
import { TestContext } from '../common/test-context';


describe('ConfigModule (Integration)', () => {
  const context = new TestContext();


  beforeAll(async () => {
    await context.setup();
  });


  afterAll(async () => {
    await context.teardown();
  });


  it('loads full configuration', () => {
    const config = context.getService<ConfigService<AppConfig, true>>(ConfigService);
    const database = config.get('database', { infer: true });
    expect(database).toBeDefined();
    expect(database.url).toBeDefined();
  });


  it('config is properly typed', () => {
    const config = context.getService<ConfigService<AppConfig, true>>(ConfigService);
    const server = config.get('server', { infer: true });
    expect(server.port).toEqual(expect.any(Number));
    expect(server.nodeEnv).toEqual(expect.any(String));
  });
});
