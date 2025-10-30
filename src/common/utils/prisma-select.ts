// src/common/utils/prisma-select.ts
import { FieldVisibility, FieldSelectorContext } from '@/common/interfaces';

/**
 * Builds a Prisma select object based on field visibility rules
 * Ensures database only fetches visible fields
 *
 * @param fieldVisibility - Configuration mapping field names to allowed visibility levels
 * @param context - Current visibility context (level, requesterId)
 * @returns Prisma select object with boolean flags for each field
 */
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
