// src/config/validators/validate-host.ts
/**
 * Pure function to validate host/bind address.
 * Accepts: localhost, IP addresses (v4/v6), domain names.
 * Returns the host if valid, throws error if invalid.
 */
export function validateHost(host: string): string {
  if (!host || !host.trim()) {
    throw new Error('HOST cannot be empty');
  }

  const trimmed = host.trim();

  // IPv4 address
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Pattern.test(trimmed)) {
    const octets = trimmed.split('.').map(Number);
    if (octets.every((octet) => octet >= 0 && octet <= 255)) {
      return host;
    }
    throw new Error(`Invalid IPv4 address: ${trimmed}`);
  }

  // IPv6 address (basic check)
  if (trimmed.includes(':') && trimmed.includes('[')) {
    // Format: [::1] or [2001:db8::1]
    const ipv6Pattern = /^\[([0-9a-fA-F:]+)\]$/;
    if (ipv6Pattern.test(trimmed)) {
      return host;
    }
    throw new Error(`Invalid IPv6 address: ${trimmed}`);
  }

  // localhost
  if (trimmed === 'localhost' || trimmed === '::1' || trimmed === '0.0.0.0') {
    return host;
  }

  // Hostname (domain name)
  const hostnamePattern =
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  if (hostnamePattern.test(trimmed)) {
    return host;
  }

  throw new Error(
    `Invalid HOST: ${trimmed}. Must be localhost, valid IPv4, IPv6, or hostname.`,
  );
}
