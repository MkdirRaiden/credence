// src/config/helpers/string-to-array.ts

export function splitStringToArray(
  value: string | undefined,
  fallback: string[] = [],
): string[] {
  if (!value || !value.trim()) return fallback;
  return value.split(',').map((v) => v.trim());
}
