// src/config/config.helper.ts
import * as fs from 'fs';
import * as path from 'path';
import { DEFAULT_ENV } from 'src/common/constants';

export function getEnvFilePaths(): string[] {
  const env = process.env.NODE_ENV || DEFAULT_ENV;

  const possibleFiles = [
    path.resolve(process.cwd(), `env/.env.${env}`),
    path.resolve(process.cwd(), `env/.env.${env}.local`),
    path.resolve(process.cwd(), `env/.env.${DEFAULT_ENV}`),
  ];

  // Filter only files
  return possibleFiles.filter((filePath) => {
    try {
      return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch {
      return false;
    }
  });
}

// Helper to ensure required env vars are set
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}
