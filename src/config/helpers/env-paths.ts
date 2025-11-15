// src/config/helpers/env-paths.ts
import { NODE_ENV } from '@/config/constants';
import * as path from 'path';
import * as fs from 'fs';

export function getEnvFilePaths(): string[] {
  const env = process.env.NODE_ENV || NODE_ENV;

  const envFolderFile = path.resolve(process.cwd(), `env/.env.${env}`);
  const rootEnvFile = path.resolve(process.cwd(), '.env');

  if (fs.existsSync(envFolderFile)) {
    return [envFolderFile];
  } else if (fs.existsSync(rootEnvFile)) {
    return [rootEnvFile];
  }

  return [];
}
