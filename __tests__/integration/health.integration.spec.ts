// __tests__/integration/health.integration.spec.ts
import { SchedulerService } from '@/health/services';
import { HealthModule } from '@/health/health.module';
import { TestContext } from '../common/test-context';

describe('HealthModule (Integration)', () => {
  const context = new TestContext();
  let scheduler: SchedulerService;

  beforeAll(async () => {
    await context.setup({
      imports: [HealthModule],
    });
    scheduler = context.getService(SchedulerService);
  });

  afterAll(async () => {
    await context.teardown();
  });

  it('scheduler service is registered', () => {
    expect(scheduler).toBeDefined();
    expect(scheduler).toBeInstanceOf(SchedulerService);
  });

  it('scheduler has start method', () => {
    expect(scheduler).toHaveProperty('start');
    expect(typeof scheduler.start).toBe('function');
  });

  it('scheduler can start with empty probes', () => {
    expect(() => {
      scheduler.start([]);
    }).not.toThrow();
  });

  it('scheduler has onApplicationShutdown method', () => {
    expect(scheduler).toHaveProperty('onApplicationShutdown');
    expect(typeof scheduler.onApplicationShutdown).toBe('function');
  });

  it('scheduler stops on application shutdown', () => {
    scheduler.start([]);
    expect(() => {
      scheduler.onApplicationShutdown('SIGTERM');
    }).not.toThrow();
  });

  it('scheduler is injected with logger and config', () => {
    expect(scheduler['logger']).toBeDefined();
    expect(scheduler['config']).toBeDefined();
  });
});
