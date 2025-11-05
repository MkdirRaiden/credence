// __tests__/unit/bootstrap/helpers/resolve-register.spec.ts
import { resolveAndRegister } from '@/bootstrap/helpers';
import { ModuleRef } from '@nestjs/core';
import { LoggerService } from '@/logger/services';
import { CRITICAL_PROVIDERS } from '@/common/modules/common.config';

describe('resolveAndRegister', () => {
  let moduleRef: Partial<ModuleRef>;
  let registerFn: jest.Mock;
  let mockLogger: Partial<LoggerService>;

  beforeEach(() => {
    registerFn = jest.fn();
    mockLogger = { warn: jest.fn() };
    moduleRef = { get: jest.fn() };
  });

  it('resolves and registers provider successfully', () => {
    class TestProvider {}
    const instance = new TestProvider();
    (moduleRef.get as jest.Mock).mockReturnValue(instance);

    resolveAndRegister(
      moduleRef as ModuleRef,
      [TestProvider],
      registerFn,
      mockLogger as any,
    );

    expect(registerFn).toHaveBeenCalledWith(instance);
  });

  it('logs warning if non-critical provider not found', () => {
    class NonCriticalProvider {}
    (moduleRef.get as jest.Mock).mockReturnValue(undefined);

    resolveAndRegister(
      moduleRef as ModuleRef,
      [NonCriticalProvider],
      registerFn,
      mockLogger as any,
    );

    expect(registerFn).not.toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'Provider NonCriticalProvider not found for registration',
      'Bootstrap',
    );
  });

  it('throws error if critical provider not found', () => {
    const CriticalProvider = class {};
    Object.defineProperty(CriticalProvider, 'name', { 
      value: CRITICAL_PROVIDERS[0] 
    });
    (moduleRef.get as jest.Mock).mockReturnValue(undefined);

    expect(() =>
      resolveAndRegister(
        moduleRef as ModuleRef,
        [CriticalProvider as any],
        registerFn,
        mockLogger as any,
      ),
    ).toThrow(`CRITICAL: Provider ${CRITICAL_PROVIDERS[0]} not found for registration`);
  });

  it('handles multiple providers', () => {
    class Provider1 {}
    class Provider2 {}
    const instance1 = new Provider1();
    const instance2 = new Provider2();

    (moduleRef.get as jest.Mock)
      .mockReturnValueOnce(instance1)
      .mockReturnValueOnce(instance2);

    resolveAndRegister(
      moduleRef as ModuleRef,
      [Provider1, Provider2],
      registerFn,
      mockLogger as any,
    );

    expect(registerFn).toHaveBeenCalledTimes(2);
    expect(registerFn).toHaveBeenNthCalledWith(1, instance1);
    expect(registerFn).toHaveBeenNthCalledWith(2, instance2);
  });
});
