// __tests__/unit/common/decorators/not-found.decorator.spec.ts
import { NotFoundException } from '@nestjs/common';
import { NotFound } from '@/common/decorators/not-found.decorator';

class TestService {
  @NotFound('Item not found')
  async findOneSuccess(): Promise<{ id: number }> {
    return { id: 1 };
  }

  @NotFound('Item not found')
  async findOneNull(): Promise<null> {
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

  it('returns result when method returns valid value', async () => {
    const result = await service.findOneSuccess();
    expect(result).toEqual({ id: 1 });
  });

  it('throws NotFoundException for null or undefined values', async () => {
    await expect(service.findOneNull()).rejects.toThrow(NotFoundException);
    await expect(service.findOneNull()).rejects.toThrow('Item not found');

    await expect(service.findOneUndefined()).rejects.toThrow(NotFoundException);
    await expect(service.findOneUndefined()).rejects.toThrow('Item undefined');
  });
});
