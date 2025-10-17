// src/config/helpers/env.paths.ts
import { NODE_ENV } from '@/common/constants';
import * as path from 'path';
import * as fs from 'fs';

export function getEnvFilePaths(): string[] {
    const env = process.env.NODE_ENV || NODE_ENV;
    const mainFile = path.resolve(process.cwd(), `env/.env.${env}`);
    return fs.existsSync(mainFile) ? [mainFile] : [];
}