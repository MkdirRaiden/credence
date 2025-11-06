// __tests__/unit/bootstrap/services/bootstrap.service.spec.ts
import { BootstrapService } from '@/bootstrap/services';
import { MiddlewareSetupService } from '@/bootstrap/services';
import { GlobalSetupService } from '@/bootstrap/services';
import { ReadinessService } from '@/bootstrap/services';
import { ServerService } from '@/bootstrap/services';
import { ShutdownService } from '@/bootstrap/services';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import type { AppConfig } from '@/common/interfaces';


describe('BootstrapService', () => {
  let service: BootstrapService;
  let mockConfig: jest.Mocked<ConfigService<AppConfig, true>>;
  let mockMiddleware: jest.Mocked<MiddlewareSetupService>;
  let mockGlobalSetup: jest.Mocked<GlobalSetupService>;
  let mockReadiness: jest.Mocked<ReadinessService>;
  let mockServer: jest.Mocked<ServerService>;
  let mockShutdown: jest.Mocked<ShutdownService>;
  let mockApp: jest.Mocked<INestApplication>;
  let mockModuleRef: jest.Mocked<ModuleRef>;


  beforeEach(() => {
    mockConfig = {
      get: jest.fn((key: string) => {
        if (key === 'server') {
          return {
            nodeEnv: 'development',
            port: 3000,
            host: 'localhost',
            globalPrefix: 'api',
            allowedOrigins: [],
            excludePrefixArray: [],
          };
        }
        return {};
      }),
    } as any;


    mockMiddleware = { setup: jest.fn() } as any;
    mockGlobalSetup = { setup: jest.fn() } as any;
    mockReadiness = { run: jest.fn().mockResolvedValue(undefined) } as any;
    mockServer = { start: jest.fn().mockResolvedValue(undefined) } as any;
    mockShutdown = { registerHandlers: jest.fn() } as any;
    mockApp = {
      get: jest.fn((provider) => {
        if (provider === ModuleRef) return mockModuleRef;
        return null;
      }),
      enableShutdownHooks: jest.fn(),
    } as any;
    mockModuleRef = {} as any;


    service = new BootstrapService(
      mockConfig,
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


      mockMiddleware.setup.mockImplementation(() => {
        callOrder.push('middleware');
      });
      mockGlobalSetup.setup.mockImplementation(() => {
        callOrder.push('globalSetup');
      });
      mockShutdown.registerHandlers.mockImplementation(() => {
        callOrder.push('shutdown');
      });


      service.init(mockApp);


      expect(callOrder).toEqual(['middleware', 'globalSetup', 'shutdown']);
    });


    it('enables shutdown hooks', () => {
      service.init(mockApp);


      expect(mockApp.enableShutdownHooks).toHaveBeenCalled();
    });


    it('gets server config once', () => {
      service.init(mockApp);


      expect(mockConfig.get).toHaveBeenCalledWith('server', { infer: true });
    });


    it('passes serverConfig to middleware setup', () => {
      service.init(mockApp);


      expect(mockMiddleware.setup).toHaveBeenCalledWith(
        mockApp,
        expect.objectContaining({
          nodeEnv: 'development',
          port: 3000,
        }),
      );
    });


    it('passes moduleRef to global setup', () => {
      service.init(mockApp);


      expect(mockGlobalSetup.setup).toHaveBeenCalledWith(mockApp, mockModuleRef);
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


    it('passes app and config to server start', async () => {
      await service.start(mockApp);


      expect(mockServer.start).toHaveBeenCalledWith(
        mockApp,
        expect.objectContaining({
          nodeEnv: 'development',
          port: 3000,
        }),
      );
    });


    it('awaits readiness before starting server', async () => {
      mockReadiness.run.mockImplementation(
        () =>
          new Promise((resolve) => {
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
