// src/config/validators/allowed-origins-validator.ts
/**
 * Pure function to validate individual origin URL.
 * Returns true if valid, throws with descriptive error if invalid.
 */
export function validateOriginUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) throw new Error('Empty origin URL');

  // Valid hostname/IP pattern (DNS-compliant)
  const urlPattern =
    /^https?:\/\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(:\d{1,5})?(\/.*)?$/;

  if (!urlPattern.test(trimmed)) {
    throw new Error(`Invalid URL format: ${trimmed}`);
  }

  // Validate port range if present
  const portMatch = trimmed.match(/:(\d+)/);
  if (portMatch) {
    const port = parseInt(portMatch[1], 10);
    if (port < 1 || port > 65535) {
      throw new Error(`Invalid port number: ${port} (must be 1-65535)`);
    }
  }

  return true;
}

/**
 * Pure function to validate comma-separated origins string.
 * Returns cleaned, validated string or throws error.
 */
export function validateAllowedOrigins(value: string): string {
  if (!value || !value.trim()) {
    return ''; // Rely on Joi default
  }

  const urls = value.split(',').map((u) => u.trim());

  // Reject empty strings or trailing commas
  if (urls.some((u) => !u)) {
    throw new Error(
      'Empty URL found in ALLOWED_ORIGINS (check for trailing commas)',
    );
  }

  // Validate each URL
  urls.forEach((url) => {
    validateOriginUrl(url);
  });

  return value; // Return original (preserves formatting)
}
