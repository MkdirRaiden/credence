// src/logger/helpers/log-writer.ts
import { LogLevel } from '@/common/interfaces';

export function logWriter(level: LogLevel, json: string): void {
  switch (level) {
    case 'ERROR':
      console.error(json);
      break;
    case 'WARN':
      console.warn(json);
      break;
    case 'INFO':
    case 'DEBUG':
    case 'VERBOSE':
    default:
      console.log(json);
      break;
  }
}
