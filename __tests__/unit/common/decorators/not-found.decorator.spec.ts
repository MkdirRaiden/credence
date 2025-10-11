import { NotFound } from '@/common/decorators/not-found.decorator';
import { NotFoundException } from '@nestjs/common';

describe('NotFound decorator', () => {
  class TestService {
    @NotFound('Item not found')
    async findItem(value: string | null | undefined) {
      return value;
    }
  }

  let service: TestService;

  beforeEach(() => {
    service = new TestService();
  });

  it('should return the value if it is not null or undefined', async () => {
    const result = await service.findItem('valid');
    expect(result).toBe('valid');
  });

  it('should throw NotFoundException if the value is null', async () => {
    await expect(service.findItem(null)).rejects.toThrow(NotFoundException);
    await expect(service.findItem(null)).rejects.toThrow('Item not found');
  });

  it('should throw NotFoundException if the value is undefined', async () => {
    // @ts-ignore to simulate undefined return
    await expect(service.findItem(undefined)).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.findItem(undefined)).rejects.toThrow('Item not found');
  });
});
