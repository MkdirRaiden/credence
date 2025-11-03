// src/common/utils/filter-undefined.ts
/**
 * Removes undefined and null values from object.
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
