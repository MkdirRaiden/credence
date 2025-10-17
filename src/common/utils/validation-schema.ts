// src/common/utils/validation-schema.ts
import * as Joi from 'joi';

// Generic comma-separated validator factory.
export function commaSeparatedValidator(
  pattern: RegExp,
  label: string,
  transform?: (value: string) => string,
) {
  return (value: string, helpers: Joi.CustomHelpers) => {
    if (!value || value.trim() === '') return [];

    const items = value
      .split(',')
      .map((v) => (transform ? transform(v.trim()) : v.trim()));

    const invalid = items.filter((item) => !pattern.test(item));
    if (invalid.length > 0) {
      return helpers.error('any.custom', {
        message: `Invalid ${label}(s): ${invalid.join(', ')}`,
      });
    }

    return items;
  };
}
