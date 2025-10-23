// __tests__/unit/common/decorators/not-found.decorator.spec.ts
import { NotFoundException } from '@nestjs/common';
import { NotFound } from '@/common/decorators/not-found.decorator';

class TestService {
  @NotFound('Item not found')
  async findOneSuccess(): Promise<{ id: number; name: string }> {
    return { id: 1, name: 'Test' };
  }

  @NotFound('Item not found')
  async findOneFail(): Promise<null> {
    return null;
  }

  @NotFound('Item undefined')
  async findOneUndefined(): Promise<undefined> {
    return undefined;
  }
}

describe('NotFound Decorator', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
  });

  it('✅ should return result if method returns valid value', async () => {
    const result = await service.findOneSuccess();
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('🚫 should throw NotFoundException if method returns null', async () => {
    await expect(service.findOneFail()).rejects.toThrow(NotFoundException);
    await expect(service.findOneFail()).rejects.toThrow('Item not found');
  });

  it('🚫 should throw NotFoundException if method returns undefined', async () => {
    await expect(service.findOneUndefined()).rejects.toThrow(NotFoundException);
    await expect(service.findOneUndefined()).rejects.toThrow('Item undefined');
  });
});
