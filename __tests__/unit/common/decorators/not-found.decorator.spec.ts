// __tests__/unit/common/decorators/not-found.decorator.spec.ts
import { NotFoundException } from '@nestjs/common';
import { NotFound } from '@/common/decorators/not-found.decorator';

class TestService {
  @NotFound('Item not found')
  async findOne(): Promise<{ id: number }> {
    return { id: 1 };
  }

  @NotFound('Not found')
  async findOneNull(): Promise<null> {
    return null;
  }

  @NotFound('Not found')
  async findOneUndefined(): Promise<undefined> {
    return undefined;
  }

  @NotFound('Error occurred')
  async findOneError(): Promise<{ id: number }> {
    throw new Error('Database error');
  }

  @NotFound('Item not found')
  async findById(id: number): Promise<{ id: number } | null> {
    return id > 0 ? { id } : null;
  }
}

describe('NotFound Decorator', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
  });

  it('returns result when method returns valid value', async () => {
    const result = await service.findOne();
    expect(result).toEqual({ id: 1 });
  });

  it('throws NotFoundException for null or undefined', async () => {
    await expect(service.findOneNull()).rejects.toThrow(NotFoundException);
    await expect(service.findOneUndefined()).rejects.toThrow(NotFoundException);
  });

  it('propagates original errors without wrapping', async () => {
    await expect(service.findOneError()).rejects.toThrow('Database error');
    await expect(service.findOneError()).rejects.not.toThrow(NotFoundException);
  });

  it('works with method parameters', async () => {
    const result = await service.findById(5);
    expect(result).toEqual({ id: 5 });

    await expect(service.findById(-1)).rejects.toThrow(NotFoundException);
  });
});
