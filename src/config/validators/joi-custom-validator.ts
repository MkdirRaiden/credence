// src/config/validators/joi-custom-validator.ts
import * as Joi from 'joi';

/**
 * Pure function that wraps a validation function for Joi.custom().
 * Generic type supports any value type (string, number, etc).
 * Converts thrown errors to Joi validation errors.
 */
export function createJoiValidator<T>(
  validatorFn: (value: T) => T,
  errorContext?: string,
) {
  return (value: T, helpers: Joi.CustomHelpers<T>) => {
    try {
      return validatorFn(value);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed';
      return helpers.error('any.custom', {
        message: errorContext ? `${errorContext}: ${message}` : message,
      });
    }
  };
}
