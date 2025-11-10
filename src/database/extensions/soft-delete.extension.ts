// src/database/extensions/soft-delete.extension.ts
import { Prisma } from '@prisma/client';
import { SOFT_DELETE_MODELS } from '@/database/constants';

/**
 * Adds soft delete filter to query args if model supports it.
 * Uses `any` cast because Prisma extension args have complex generic types.
 */
function applySoftDeleteFilter(args: any, model: string): void {
  if (!SOFT_DELETE_MODELS.includes(model)) return;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  args.where = args.where || {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (args.where.deletedAt === undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    args.where.deletedAt = null;
  }
}

export const softDeleteExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      async findUnique({ args, query, model }) {
        applySoftDeleteFilter(args, model);
        return query(args);
      },
      async findFirst({ args, query, model }) {
        applySoftDeleteFilter(args, model);
        return query(args);
      },
      async findMany({ args, query, model }) {
        applySoftDeleteFilter(args, model);
        return query(args);
      },
    },
  },
});
