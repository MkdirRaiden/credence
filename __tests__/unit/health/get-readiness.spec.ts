// __tests__/unit/health/helpers/get-readiness.spec.ts
import { getReadiness } from '@/health/helpers/get-readiness';
import type { Probe } from '@/health/health.interface';

describe('getReadiness', () => {
  it('returns ok when all probes are up', async () => {
    const probe: Probe = {
      name: 'database',
      check: jest.fn().mockResolvedValue({
        name: 'database',
        status: 'up',
      }),
    };

    const result = await getReadiness([probe]);

    expect(result.status).toBe('ok');
    expect(result.details.database.status).toBe('up');
  });

  it('returns error when any probe is down', async () => {
    const upProbe: Probe = {
      name: 'cache',
      check: jest.fn().mockResolvedValue({ name: 'cache', status: 'up' }),
    };
    const downProbe: Probe = {
      name: 'database',
      check: jest.fn().mockResolvedValue({
        name: 'database',
        status: 'down',
        message: 'Connection failed',
      }),
    };

    const result = await getReadiness([upProbe, downProbe]);

    expect(result.status).toBe('error');
    expect(result.details.database.message).toBe('Connection failed');
  });

  it('passes timeout option to probes', async () => {
    const probe: Probe = {
      name: 'database',
      check: jest.fn().mockResolvedValue({ name: 'database', status: 'up' }),
    };

    await getReadiness([probe], { timeout: 3000 });

    expect(probe.check).toHaveBeenCalledWith({ timeout: 3000 });
  });
});
