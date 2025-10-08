import * as Joi from 'joi';

/**
 * Generic comma-separated validator factory.
 * @param pattern - Regex to validate each item (e.g. URL, email, etc.)
 * @param label - Human-readable label for error messages
 * @param transform - Optional function to further process each item
 */
export function commaSeparatedValidator(
  pattern: RegExp,
  label: string,
  transform?: (value: string) => string,
) {
  return (value: string, helpers: Joi.CustomHelpers) => {
    if (!value) return [];

    const items = value
      .split(',')
      .map((v) => (transform ? transform(v.trim()) : v.trim()));
    const invalid = items.filter((item) => !pattern.test(item));

    if (invalid.length > 0) {
      return helpers.error('any.invalid', {
        message: `Invalid ${label}(s): ${invalid.join(', ')}`,
      });
    }

    return items;
  };
}
