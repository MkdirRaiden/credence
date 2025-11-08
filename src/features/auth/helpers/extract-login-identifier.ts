// src/features/auth/helpers/extract-login-identifier.ts

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
