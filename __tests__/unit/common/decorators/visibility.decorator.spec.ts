// __tests__/unit/common/decorators/visibility.decorator.spec.ts
import { Reflector } from '@nestjs/core';
import { Visibility } from '@/common/decorators/visibility.decorator';
import { VISIBILITY_KEY } from '@/common/constants';
import type { VisibilityLevel } from '@/common/interfaces';

describe('Visibility Decorator', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('sets public visibility metadata', () => {
    class TestController {
      @Visibility('public')
      findAll() {}
    }

    const metadata = reflector.get<VisibilityLevel>(
      VISIBILITY_KEY,
      TestController.prototype.findAll,
    );

    expect(metadata).toBe('public');
  });

  it('sets admin visibility metadata', () => {
    class TestController {
      @Visibility('admin')
      deleteAll() {}
    }

    const metadata = reflector.get<VisibilityLevel>(
      VISIBILITY_KEY,
      TestController.prototype.deleteAll,
    );

    expect(metadata).toBe('admin');
  });

  it('metadata persists across multiple decorators', () => {
    // Simulate combining with other decorators
    class TestController {
      @Visibility('public')
      getData() {}

      @Visibility('admin')
      deleteData() {}
    }

    const publicMeta = reflector.get<VisibilityLevel>(
      VISIBILITY_KEY,
      TestController.prototype.getData,
    );
    const adminMeta = reflector.get<VisibilityLevel>(
      VISIBILITY_KEY,
      TestController.prototype.deleteData,
    );

    expect(publicMeta).toBe('public');
    expect(adminMeta).toBe('admin');
  });
});
