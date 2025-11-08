// __tests__/unit/bootstrap/services/shutdown.service.spec.ts
import { ShutdownService } from '@/bootstrap/services';
import { LOG_CONTEXTS } from '@/logger/constants';
import { LoggerService } from '@/logger/services';
import { INestApplication } from '@nestjs/common';

describe('ShutdownService', () => {
  let service: ShutdownService;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockApp: jest.Mocked<INestApplication>;
  let processOnSpy: jest.SpyInstance;
  let processRemoveListenerSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;
  let handlers: Map<string, Function>;

  beforeEach(() => {
    mockLogger = {
      log: jest.fn(),
    } as any;

    mockApp = {
      close: jest.fn().mockResolvedValue(undefined),
    } as any;

    handlers = new Map();
    processOnSpy = jest
      .spyOn(process, 'on')
      .mockImplementation((signal, handler) => {
        handlers.set(signal as string, handler as Function);
        return process;
      });

    processRemoveListenerSpy = jest
      .spyOn(process, 'removeListener')
      .mockReturnValue(process);

    exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);

    service = new ShutdownService(mockLogger);
  });

  afterEach(() => {
    processOnSpy.mockRestore();
    processRemoveListenerSpy.mockRestore();
    exitSpy.mockRestore();
    handlers.clear();
  });

  it('registers SIGTERM handler', () => {
    service.registerHandlers(mockApp);

    expect(handlers.has('SIGTERM')).toBe(true);
  });

  it('registers SIGINT handler', () => {
    service.registerHandlers(mockApp);

    expect(handlers.has('SIGINT')).toBe(true);
  });

  it('logs message on SIGTERM and closes app', async () => {
    service.registerHandlers(mockApp);
    const sigTermHandler = handlers.get('SIGTERM');

    sigTermHandler?.();

    expect(mockLogger.log).toHaveBeenCalledWith(
      'SIGTERM received, shutting down gracefully...',
      LOG_CONTEXTS.SHUTDOWN,
    );

    await new Promise((resolve) => setImmediate(resolve));
    expect(mockApp.close).toHaveBeenCalled();
  });

  it('logs message on SIGINT and closes app', async () => {
    service.registerHandlers(mockApp);
    const sigIntHandler = handlers.get('SIGINT');

    sigIntHandler?.();

    expect(mockLogger.log).toHaveBeenCalledWith(
      'SIGINT received, shutting down gracefully...',
      LOG_CONTEXTS.SHUTDOWN,
    );

    await new Promise((resolve) => setImmediate(resolve));
    expect(mockApp.close).toHaveBeenCalled();
  });

  it('exits with code 0 on successful close', async () => {
    mockApp.close.mockResolvedValue(undefined);
    service.registerHandlers(mockApp);
    const sigTermHandler = handlers.get('SIGTERM');

    sigTermHandler?.();

    await new Promise((resolve) => setImmediate(resolve));

    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  it('exits with code 1 on close error', async () => {
    mockApp.close.mockRejectedValue(new Error('Close failed'));
    service.registerHandlers(mockApp);
    const sigTermHandler = handlers.get('SIGTERM');

    sigTermHandler?.();

    await new Promise((resolve) => setImmediate(resolve));

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
