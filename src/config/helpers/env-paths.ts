// src/config/helpers/env-paths.ts
import { NODE_ENV } from '@/common/constants';
import * as path from 'path';
import * as fs from 'fs';

export function getEnvFilePaths(): string[] {
  const env = process.env.NODE_ENV || NODE_ENV;

  // Try env folder first (env/.env.development, env/.env.test, etc.)
  const envFolderFile = path.resolve(process.cwd(), `env/.env.${env}`);

  // Fallback to root .env file
  const rootEnvFile = path.resolve(process.cwd(), '.env');

  // Return environment-specific file if exists, otherwise fallback to root .env
  if (fs.existsSync(envFolderFile)) {
    return [envFolderFile];
  } else if (fs.existsSync(rootEnvFile)) {
    return [rootEnvFile];
  }

  // Return empty array if no env file found (will use defaults/fail validation)
  return [];
}
