// src/common/utils/filter-undefined.ts
/**
 * Filter out undefined and null values from an object
 * Useful for mappers to convert Partial<T> to clean response objects
 *
 * @param obj - Object to filter
 * @returns Object with only defined and non-null values
 *
 * @example
 * const user = { id: "123", email: null, name: undefined };
 * filterUndefined(user); // { id: "123" }
 */
export const filterUndefined = <T extends Record<string, any>>(
  obj: T,
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  ) as Partial<T>;
};
