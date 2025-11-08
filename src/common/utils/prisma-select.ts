// src/common/utils/prisma-select.ts
import { FieldVisibility, FieldSelectorContext } from '@/common/interfaces';

export function createPrismaSelect(
  fieldVisibility: FieldVisibility,
  context: FieldSelectorContext,
): Record<string, boolean> {
  return Object.fromEntries(
    Object.entries(fieldVisibility).map(([key, levels]) => [
      key,
      levels.includes(context.level),
    ]),
  );
}
