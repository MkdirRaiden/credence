// src/config/validators/create-external-validator.ts
export function createExternalValidator<T>(
  validatorFn: (value: T) => T,
  errorPrefix?: string,
) {
  return (value: T): Promise<T> => {
    try {
      const result = validatorFn(value);
      return Promise.resolve(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed';
      return Promise.reject(
        new Error(errorPrefix ? `${errorPrefix}: ${message}` : message),
      );
    }
  };
}
