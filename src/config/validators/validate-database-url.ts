// src/config/validators/validate-database-url.ts
/**
 * Pure function to validate PostgreSQL connection URL.
 * Ensures: correct protocol, host exists, database name exists.
 * Returns the URL if valid, throws error if invalid.
 */
export function validateDatabaseUrl(url: string): string {
  if (!url || !url.trim()) {
    throw new Error('DATABASE_URL cannot be empty');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`Invalid DATABASE_URL format: ${url}`);
  }

  // Protocol must be PostgreSQL
  const protocol = parsedUrl.protocol;
  if (!['postgresql:', 'postgres:'].includes(protocol)) {
    throw new Error(
      `DATABASE_URL protocol must be 'postgresql://' or 'postgres://'. Got: '${protocol}//'`,
    );
  }

  // Host must exist
  if (!parsedUrl.hostname) {
    throw new Error('DATABASE_URL must include hostname/IP address');
  }

  // Database name must exist (pathname)
  if (!parsedUrl.pathname || parsedUrl.pathname === '/') {
    throw new Error(
      'DATABASE_URL must include database name (e.g., postgresql://user:pass@host/dbname)',
    );
  }

  // Port validation (if provided)
  if (parsedUrl.port) {
    const port = parseInt(parsedUrl.port, 10);
    if (port < 1 || port > 65535) {
      throw new Error(`Invalid port in DATABASE_URL: ${port}`);
    }
  }

  // Username should ideally exist (warning only, don't fail)
  if (!parsedUrl.username) {
    console.warn(
      'DATABASE_URL does not contain username. This may indicate a misconfiguration.',
    );
  }

  return url;
}
