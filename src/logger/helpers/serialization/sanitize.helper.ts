// src/logger/helpers/serialization/sanitize.helper.ts
import { SENSITIVE_FIELDS } from '@/logger/constants';

const SENSITIVE_FIELDS_LOWER = SENSITIVE_FIELDS.map((field) =>
  field.toLowerCase(),
);

export function sanitizeLog(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLog(item));
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();

    // Only redact if full field (case-insensitive) matches
    if (SENSITIVE_FIELDS_LOWER.includes(lowerKey)) {
      sanitized[key] = '[REDACTED]';
    } else if (value !== null && typeof value === 'object') {
      sanitized[key] = sanitizeLog(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
