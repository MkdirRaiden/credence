// __tests__/unit/common/decorators/visibility.decorator.spec.ts
import { Reflector } from '@nestjs/core';
import { Visibility } from '@/common/decorators/visibility.decorator';
import { VISIBILITY_KEY } from '@/common/constants';
import type { VisibilityLevel } from '@/common/interfaces';


describe('Visibility Decorator', () => {
  const reflector = new Reflector();

  it('sets visibility metadata correctly', () => {
    class TestController {
      @Visibility('public')
      publicMethod() {}

      @Visibility('admin')
      adminMethod() {}
    }

    const publicMeta = reflector.get<VisibilityLevel>(
      VISIBILITY_KEY,
      TestController.prototype.publicMethod,
    );
    const adminMeta = reflector.get<VisibilityLevel>(
      VISIBILITY_KEY,
      TestController.prototype.adminMethod,
    );

    expect(publicMeta).toBe('public');
    expect(adminMeta).toBe('admin');
  });

  it('uses VISIBILITY_KEY constant for metadata', () => {
    class TestController {
      @Visibility('public')
      getData() {}
    }

    const metadata = reflector.get(
      VISIBILITY_KEY,
      TestController.prototype.getData,
    );

    expect(metadata).toBeDefined();
    expect(typeof VISIBILITY_KEY).toBe('string');
  });
});
