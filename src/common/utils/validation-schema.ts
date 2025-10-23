// src/common/utils/validation-schema.ts
import * as Joi from 'joi';

export function commaSeparatedValidator(
  pattern: RegExp,
  label: string,
  transform?: (value: string) => string,
) {
  return (value: unknown, helpers: Joi.CustomHelpers) => {
    if (typeof value !== 'string') {
      return helpers.error('string.base', { label });
    }

    if (!value.trim()) {
      return []; // empty string -> empty array
    }

    const items = value.split(',').map((v) => (transform ? transform(v.trim()) : v.trim()));
    const invalid = items.filter((item) => !pattern.test(item));

    if (invalid.length > 0) {
      // Custom error code
      return helpers.error('comma.invalid', { items: invalid.join(',') });
    }

    return items;
  };
}
