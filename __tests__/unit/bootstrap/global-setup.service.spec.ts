// __tests__/unit/bootstrap/services/global-setup.service.spec.ts
import { ValidationPipe } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { GlobalSetupService } from '@/bootstrap/services/internals';
import { LoggerService } from '@/logger/services';
import { GLOBAL_FILTERS, GLOBAL_INTERCEPTORS } from '@/common/modules';
import type { AppConfig } from '@/common/interfaces';

// NOTE: We don’t care about Swagger internals in this unit test, only
// that setup() wires pipes/interceptors/filters correctly.
// So we mock SwaggerModule.createDocument/setup to no-op.
jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue({}),
    setup: jest.fn(),
  },
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({}),
  })),
}));

describe('GlobalSetupService', () => {
  let service: GlobalSetupService;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockConfig: jest.Mocked<ConfigService<AppConfig, true>>;
  let mockApp: {
    useGlobalPipes: jest.Mock;
    useGlobalInterceptors: jest.Mock;
    useGlobalFilters: jest.Mock;
    getHttpAdapter: jest.Mock;
    _pipesCallIndex?: number;
    _interceptorsCallIndex?: number;
    _filtersCallIndex?: number;
  };
  let mockModuleRef: jest.Mocked<ModuleRef>;

  beforeEach(() => {
    mockLogger = {
      warn: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
    } as any;

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
        if (key === 'app') {
          return {
            appName: 'Credence',
            appVersion: '1.0.0',
            swaggerDescription: 'Credence API',
            apiDocsPath: '/docs',
          };
        }
        return {} as any;
      }),
    } as any;

    mockApp = {
      useGlobalPipes: jest.fn(),
      useGlobalInterceptors: jest.fn(),
      useGlobalFilters: jest.fn(),
      getHttpAdapter: jest.fn().mockReturnValue({
        getType: jest.fn().mockReturnValue('express'),
      }),
    };

    const providerInstances = new Map<any, any>();
    GLOBAL_INTERCEPTORS.forEach((provider) => {
      providerInstances.set(provider, {
        name: provider.name,
        interceptor: true,
      });
    });
    GLOBAL_FILTERS.forEach((provider) => {
      providerInstances.set(provider, {
        name: provider.name,
        filter: true,
      });
    });

    mockModuleRef = {
      get: jest.fn((provider: any) => providerInstances.get(provider)),
    } as any;

    service = new GlobalSetupService(mockLogger, mockConfig);
  });

  describe('setup', () => {
    it('sets up validation pipe', () => {
      service.setup(mockApp as any, mockModuleRef);

      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
        expect.any(ValidationPipe),
      );
    });

    it('resolves and registers all interceptors (one call per provider)', () => {
      service.setup(mockApp as any, mockModuleRef);

      expect(mockApp.useGlobalInterceptors).toHaveBeenCalledTimes(
        GLOBAL_INTERCEPTORS.length,
      );

      GLOBAL_INTERCEPTORS.forEach((provider, index) => {
        const call = mockApp.useGlobalInterceptors.mock.calls[index];

        expect(call).toHaveLength(1);

        const instance = call[0];
        expect(instance).toBeDefined();
        expect(instance.name).toBe(provider.name);
        expect((instance as any).interceptor).toBe(true);
      });
    });

    it('resolves and registers all filters (one call per provider)', () => {
      service.setup(mockApp as any, mockModuleRef);

      expect(mockApp.useGlobalFilters).toHaveBeenCalledTimes(
        GLOBAL_FILTERS.length,
      );

      GLOBAL_FILTERS.forEach((provider, index) => {
        const call = mockApp.useGlobalFilters.mock.calls[index];

        expect(call).toHaveLength(1);

        const instance = call[0];
        expect(instance).toBeDefined();
        expect(instance.name).toBe(provider.name);
        expect((instance as any).filter).toBe(true);
      });
    });

    it('calls setup methods in correct order: pipes → interceptors → filters', () => {
      let callIndex = 0;

      mockApp.useGlobalPipes.mockImplementation(() => {
        mockApp._pipesCallIndex = callIndex++;
      });

      mockApp.useGlobalInterceptors.mockImplementation(() => {
        mockApp._interceptorsCallIndex = callIndex++;
      });

      mockApp.useGlobalFilters.mockImplementation(() => {
        mockApp._filtersCallIndex = callIndex++;
      });

      service.setup(mockApp as any, mockModuleRef);

      expect(mockApp._pipesCallIndex).toBeLessThan(
        mockApp._interceptorsCallIndex!,
      );
      expect(mockApp._interceptorsCallIndex).toBeLessThan(
        mockApp._filtersCallIndex!,
      );
    });

    it('logs a warning when a provider cannot be resolved (non-strict)', () => {
      const missingProvider = GLOBAL_INTERCEPTORS[0];

      mockModuleRef.get.mockImplementation((provider: any) => {
        if (provider === missingProvider) {
          return undefined;
        }
        return {};
      });

      service.setup(mockApp as any, mockModuleRef);

      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });
});
