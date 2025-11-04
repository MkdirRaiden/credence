// src/common/utils/extract-config.ts
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces';

/**
 * Extracts typed config keys from ConfigService as Pick<AppConfig, K>.
 */
export function extractConfig<K extends keyof AppConfig>(
  configService: ConfigService<AppConfig, true>,
  keys: readonly K[],
): Pick<AppConfig, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = configService.get(key, { infer: true });
      return acc;
    },
    {} as Pick<AppConfig, K>,
  );
}
