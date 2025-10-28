// __tests__/unit/bootstrap/resolve-register.spec.ts
import { resolveAndRegister } from '@/bootstrap/helpers/resolve-register';
import { ModuleRef } from '@nestjs/core';
import { LoggerService } from '@/logger/logger.service';

describe('resolveAndRegister', () => {
  let moduleRef: Partial<ModuleRef>;
  let registerFn: jest.Mock;
  let mockLogger: Partial<LoggerService>;

  beforeEach(() => {
    registerFn = jest.fn();
    mockLogger = { warn: jest.fn() };
    moduleRef = {
      get: jest.fn(),
    };
  });

  it('resolves class providers from moduleRef and registers them', () => {
    class TestProvider {}
    const instance = new TestProvider();
    (moduleRef.get as jest.Mock).mockReturnValue(instance);

    resolveAndRegister(
      moduleRef as ModuleRef,
      [TestProvider],
      registerFn,
      mockLogger as any,
    );

    expect(moduleRef.get).toHaveBeenCalledWith(TestProvider, { strict: false });
    expect(registerFn).toHaveBeenCalledWith(instance);
    expect(mockLogger.warn as jest.Mock).not.toHaveBeenCalled();
  });

  it('logs warning if provider not found', () => {
    class MissingProvider {}
    (moduleRef.get as jest.Mock).mockReturnValue(undefined);

    resolveAndRegister(
      moduleRef as ModuleRef,
      [MissingProvider],
      registerFn,
      mockLogger as any,
    );

    expect(registerFn).not.toHaveBeenCalled();
    expect(mockLogger.warn as jest.Mock).toHaveBeenCalledWith(
      'Provider MissingProvider not found for registration',
      'Bootstrap',
    );
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
    expect(registerFn).toHaveBeenCalledWith(instance1);
    expect(registerFn).toHaveBeenCalledWith(instance2);
  });
});
