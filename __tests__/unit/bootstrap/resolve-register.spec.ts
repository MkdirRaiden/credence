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

  it('✅ registers instances when objects are provided directly', () => {
    const obj = { foo: 'bar' };
    resolveAndRegister(moduleRef as ModuleRef, [obj], registerFn, mockLogger as any);

    expect(registerFn).toHaveBeenCalledWith(obj);
    expect((mockLogger.warn as jest.Mock)).not.toHaveBeenCalled();
  });

  it('✅ resolves class providers from moduleRef and registers them', () => {
    class TestProvider {}
    const instance = new TestProvider();
    (moduleRef.get as jest.Mock).mockReturnValue(instance);

    resolveAndRegister(moduleRef as ModuleRef, [TestProvider], registerFn, mockLogger as any);

    expect(moduleRef.get).toHaveBeenCalledWith(TestProvider, { strict: false });
    expect(registerFn).toHaveBeenCalledWith(instance);
    expect((mockLogger.warn as jest.Mock)).not.toHaveBeenCalled();
  });

  it('🚫 logs warning if provider not found', () => {
    class MissingProvider {}
    (moduleRef.get as jest.Mock).mockReturnValue(undefined);

    resolveAndRegister(moduleRef as ModuleRef, [MissingProvider], registerFn, mockLogger as any);

    expect(registerFn).not.toHaveBeenCalled();
    expect((mockLogger.warn as jest.Mock)).toHaveBeenCalledWith(
      'Global provider not found for registration',
      'MissingProvider',
    );
  });
});
