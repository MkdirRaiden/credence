// __tests__/integration/bootstrap.integration.spec.ts
import { BootstrapService } from '@/bootstrap/services';
import { BootstrapModule } from '@/bootstrap/bootstrap.module'; 
import { TestContext } from '../common/test-context';


describe('BootstrapModule (Integration)', () => {
  const context = new TestContext();


  beforeAll(async () => {
    await context.setup({
      imports: [BootstrapModule], // ← Add to metadata
    });
  });


  afterAll(async () => {
    await context.teardown();
  });


  it('initializes bootstrap service', () => {
    const bootstrap = context.getService(BootstrapService);
    expect(bootstrap).toBeDefined();
    expect(bootstrap).toHaveProperty('init');
    expect(bootstrap).toHaveProperty('start');
  });
});
