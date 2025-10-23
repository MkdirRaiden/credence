// __tests__/unit/common/utils/validation-schema.spec.ts
import * as Joi from 'joi';
import { commaSeparatedValidator } from '@/common/utils';

describe('commaSeparatedValidator', () => {
  // Case-insensitive to allow uppercase after transform
  const pattern = /^[a-z]+$/i;
  const label = 'item';

  it('returns empty array for empty string', () => {
    const schema = Joi.any()
      .custom(commaSeparatedValidator(pattern, label))
      .messages({ 'comma.invalid': 'Invalid item(s): {{#items}}' });

    const { value, error } = schema.validate('');
    expect(error).toBeUndefined();
    expect(value).toEqual([]);
  });

  it('returns error for invalid items', () => {
    const schema = Joi.any()
      .custom(commaSeparatedValidator(pattern, label))
      .messages({ 'comma.invalid': 'Invalid item(s): {{#items}}' });

    const input = 'foo,Bar,123';
    const { value, error } = schema.validate(input);

    expect(error).toBeDefined();
    expect(error?.details?.[0]?.message).toContain('Invalid item(s): 123');
    // Joi keeps the original input on validation error
    expect(value).toEqual(input);
  });

  it('applies transform function if provided', () => {
    const schema = Joi.any()
      .custom(commaSeparatedValidator(pattern, label, (v) => v.toUpperCase()))
      .messages({ 'comma.invalid': 'Invalid item(s): {{#items}}' });

    const { value, error } = schema.validate('foo,bar');
    expect(error).toBeUndefined();
    expect(value).toEqual(['FOO', 'BAR']);
  });

  it('passes valid input without transform', () => {
    const schema = Joi.any()
      .custom(commaSeparatedValidator(pattern, label))
      .messages({ 'comma.invalid': 'Invalid item(s): {{#items}}' });

    const { value, error } = schema.validate('foo,bar,baz');
    expect(error).toBeUndefined();
    expect(value).toEqual(['foo', 'bar', 'baz']);
  });

  it('trims spaces in input', () => {
    const schema = Joi.any()
      .custom(commaSeparatedValidator(pattern, label))
      .messages({ 'comma.invalid': 'Invalid item(s): {{#items}}' });

    const { value, error } = schema.validate('  foo ,  bar,baz  ');
    expect(error).toBeUndefined();
    expect(value).toEqual(['foo', 'bar', 'baz']);
  });
});
