// __tests__/unit/bootstrap/services/bootstrap.service.spec.ts
import { INestApplication } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { BootstrapService } from '@/bootstrap/services';
import * as services from '@/bootstrap/services/internals';

describe('BootstrapService', () => {
  let service: BootstrapService;

  let mockMiddleware: jest.Mocked<services.MiddlewareSetupService>;
  let mockGlobalSetup: jest.Mocked<services.GlobalSetupService>;
  let mockReadiness: jest.Mocked<services.ReadinessService>;
  let mockServer: jest.Mocked<services.ServerService>;
  let mockShutdown: jest.Mocked<services.ShutdownService>;

  let mockApp: jest.Mocked<INestApplication>;
  let mockModuleRef: jest.Mocked<ModuleRef>;

  beforeEach(() => {
    mockMiddleware = { setup: jest.fn() } as any;
    mockGlobalSetup = { setup: jest.fn() } as any;
    mockReadiness = { run: jest.fn().mockResolvedValue(undefined) } as any;
    mockServer = { start: jest.fn().mockResolvedValue(undefined) } as any;
    mockShutdown = { registerHandlers: jest.fn() } as any;

    mockModuleRef = {} as any;

    mockApp = {
      get: jest.fn((provider) => {
        if (provider === ModuleRef) {
          return mockModuleRef;
        }
        return null;
      }),
      enableShutdownHooks: jest.fn(),
    } as any;

    service = new BootstrapService(
      mockMiddleware,
      mockGlobalSetup,
      mockReadiness,
      mockServer,
      mockShutdown,
    );
  });

  describe('init', () => {
    it('calls services in correct order', () => {
      const callOrder: string[] = [];

      mockGlobalSetup.setup.mockImplementation(() => {
        callOrder.push('globalSetup');
      });

      mockMiddleware.setup.mockImplementation(() => {
        callOrder.push('middleware');
      });

      mockShutdown.registerHandlers.mockImplementation(() => {
        callOrder.push('shutdown');
      });

      service.init(mockApp);

      expect(callOrder).toEqual(['globalSetup', 'middleware', 'shutdown']);
    });

    it('enables shutdown hooks', () => {
      service.init(mockApp);

      expect(mockApp.enableShutdownHooks).toHaveBeenCalled();
    });

    it('resolves ModuleRef from app and passes to global setup', () => {
      service.init(mockApp);

      expect(mockApp.get).toHaveBeenCalledWith(ModuleRef);
      expect(mockGlobalSetup.setup).toHaveBeenCalledWith(
        mockApp,
        mockModuleRef,
      );
    });

    it('calls middleware setup with app only', () => {
      service.init(mockApp);

      expect(mockMiddleware.setup).toHaveBeenCalledWith(mockApp);
    });

    it('registers shutdown handlers with app', () => {
      service.init(mockApp);

      expect(mockShutdown.registerHandlers).toHaveBeenCalledWith(mockApp);
    });
  });

  describe('start', () => {
    it('runs readiness check before server start', async () => {
      const callOrder: string[] = [];

      mockReadiness.run.mockImplementation(async () => {
        callOrder.push('readiness');
      });

      mockServer.start.mockImplementation(async () => {
        callOrder.push('server');
      });

      await service.start(mockApp);

      expect(callOrder).toEqual(['readiness', 'server']);
    });

    it('passes app to server start', async () => {
      await service.start(mockApp);

      expect(mockServer.start).toHaveBeenCalledWith(mockApp);
    });

    it('awaits readiness before starting server', async () => {
      mockReadiness.run.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            setTimeout(resolve, 100);
          }),
      );

      const startTime = Date.now();
      await service.start(mockApp);
      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(100);
      expect(mockServer.start).toHaveBeenCalled();
    });
  });
});
