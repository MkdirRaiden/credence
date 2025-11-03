// src/config/helpers/string-to-array.ts
/**
 * Parses comma-separated string into trimmed array of values.
 */
export function splitStringToArray(
  value: string | undefined,
  fallback: string[] = [],
): string[] {
  if (!value || !value.trim()) return fallback;
  return value.split(',').map((v) => v.trim());
}