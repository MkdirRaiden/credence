// __tests__/unit/bootstrap/services/global-setup.service.spec.ts
import { GlobalSetupService } from '@/bootstrap/services';
import { LoggerService } from '@/logger/services';
import { ModuleRef } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { GLOBAL_INTERCEPTORS, GLOBAL_FILTERS } from '@/common/modules';


describe('GlobalSetupService', () => {
  let service: GlobalSetupService;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockApp: any;
  let mockModuleRef: jest.Mocked<ModuleRef>;


  beforeEach(() => {
    mockLogger = {
      warn: jest.fn(),
    } as any;


    mockApp = {
      useGlobalPipes: jest.fn(),
      useGlobalInterceptors: jest.fn(),
      useGlobalFilters: jest.fn(),
    };


    // Create a map of provider → mock instance
    const providerInstances = new Map();
    GLOBAL_INTERCEPTORS.forEach((provider) => {
      providerInstances.set(provider, { name: provider.name, interceptor: true });
    });
    GLOBAL_FILTERS.forEach((provider) => {
      providerInstances.set(provider, { name: provider.name, filter: true });
    });


    mockModuleRef = {
      get: jest.fn((provider: any) => {
        return providerInstances.get(provider);
      }),
    } as any;


    service = new GlobalSetupService(mockLogger);
  });


  describe('setup', () => {
    it('sets up validation pipe', () => {
      service.setup(mockApp, mockModuleRef);


      expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
        expect.any(ValidationPipe),
      );
    });


    it('resolves and registers interceptors', () => {
      service.setup(mockApp, mockModuleRef);


      expect(mockApp.useGlobalInterceptors).toHaveBeenCalled();
      GLOBAL_INTERCEPTORS.forEach((interceptor) => {
        expect(mockModuleRef.get).toHaveBeenCalledWith(interceptor, {
          strict: false,
        });
      });
    });


    it('resolves and registers filters', () => {
      service.setup(mockApp, mockModuleRef);


      expect(mockApp.useGlobalFilters).toHaveBeenCalled();
      GLOBAL_FILTERS.forEach((filter) => {
        expect(mockModuleRef.get).toHaveBeenCalledWith(filter, {
          strict: false,
        });
      });
    });


    it('calls setup methods in correct order: pipes first', () => {
      const pipesCallIndex = -1;
      const interceptorsCallIndex = -1;
      const filtersCallIndex = -1;


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


      service.setup(mockApp, mockModuleRef);


      // Verify pipes is called first
      expect(mockApp._pipesCallIndex).toBeLessThan(mockApp._interceptorsCallIndex);
      // Verify interceptors before filters
      expect(mockApp._interceptorsCallIndex).toBeLessThan(mockApp._filtersCallIndex);
    });
  });
});
