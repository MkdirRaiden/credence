// src/config/validators/validate-jwt-secrets.ts
/**
 * Pure function to validate JWT secret strength.
 * HS256 requires minimum 32 characters (256 bits).
 * Returns the secret if valid, throws error if invalid.
 */
export function validateJwtSecret(secret: string): string {
  if (!secret || !secret.trim()) {
    throw new Error('JWT secret cannot be empty');
  }

  const trimmed = secret.trim();

  if (trimmed.length < 32) {
    throw new Error(
      `JWT secret must be at least 32 characters (for HS256). Current length: ${trimmed.length}`,
    );
  }

  // Warn if too weak (common patterns)
  const weakPatterns = [
    /^(password|secret|token|jwt|test|demo|debug|admin|user)/i,
    /^[a-z0-9]{32}$/i, // All lowercase/numbers only
    /^([a-z0-9])\1+$/i, // Repeated characters
  ];

  const isWeak = weakPatterns.some((pattern) => pattern.test(trimmed));
  if (isWeak) {
    throw new Error(
      'JWT secret appears too weak. Use a cryptographically random string (e.g., from `openssl rand -base64 32`)',
    );
  }

  return secret;
}
