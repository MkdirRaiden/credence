// src/features/auth/helpers/extract-login-identifier.ts
/**
 * Extracts login identifier (email or username) from Passport's validate params.
 * Handles the case where Passport might only provide email field.
 *
 * @param email - Email from Passport (might be empty)
 * @param requestBody - Express request body (contains username if provided)
 * @returns Login identifier (email or username)
 * @throws Error if neither email nor username provided
 */
export function extractLoginIdentifier(
  email: string | undefined,
  requestBody?: Record<string, unknown>,
): string {
  const emailOrUsername = email || (requestBody?.username as string);

  if (!emailOrUsername) {
    throw new Error('Either email or username is required');
  }

  return emailOrUsername;
}
