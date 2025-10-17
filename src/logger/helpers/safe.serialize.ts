//src/logger/helpers/safe.serialize.ts
export function safeSerialize(input: unknown): string {
  if (input instanceof Error) return input.message || String(input);
  if (typeof input === 'string') return input;
  try {
    return JSON.stringify(input);
  } catch {
    return String(input);
  }
}
