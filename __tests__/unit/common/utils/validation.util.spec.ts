import * as Joi from 'joi';
import { commaSeparatedValidator } from '@/common/utils/validation.util';

describe('commaSeparatedValidator', () => {
  const schema = Joi.any().custom(
    commaSeparatedValidator(/^[a-zA-Z]+$/, 'word'),
  );

  it('should return empty array for empty string', () => {
    const { error, value } = schema.validate('');
    expect(error).toBeUndefined();
    expect(value).toEqual([]);
  });

  it('should fail invalid items', () => {
    const { error } = schema.validate('a,2,b$');
    expect(error).toBeDefined();

    // Correct way to access custom message
    const customMessage = error?.details[0]?.context?.message;
    expect(customMessage).toContain('Invalid word(s)');
  });

  it('should apply transform function', () => {
    const transformSchema = Joi.any().custom(
      commaSeparatedValidator(/^[a-z]+$/, 'word', (v) => v.toLowerCase()),
    );
    const { value } = transformSchema.validate('A,B,C');
    expect(value).toEqual(['a', 'b', 'c']);
  });
});
