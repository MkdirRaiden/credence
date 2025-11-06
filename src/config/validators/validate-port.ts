// src/config/validators/validate-port.ts
/**
 * Pure function to validate port number.
 * Valid range: 1-65535.
 * Optionally warn about privileged ports (< 1024 on Unix systems).
 */
export function validatePort(portValue: number | string): number {
  let port: number;

  if (typeof portValue === 'string') {
    port = parseInt(portValue, 10);
    if (isNaN(port)) {
      throw new Error(`PORT must be a valid number. Received: ${portValue}`);
    }
  } else {
    port = portValue;
  }

  if (!Number.isInteger(port)) {
    throw new Error(`PORT must be an integer. Received: ${port}`);
  }

  if (port < 1 || port > 65535) {
    throw new Error(`PORT must be between 1 and 65535. Received: ${port}`);
  }

  // Warn about privileged ports (only on Unix-like systems)
  if (
    process.platform !== 'win32' &&
    port < 1024 &&
    port !== 80 &&
    port !== 443
  ) {
    console.warn(
      `⚠️  PORT ${port} is a privileged port on Unix systems. You may need to run with sudo or use a port >= 1024.`,
    );
  }

  return port;
}
