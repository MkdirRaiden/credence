// src/database/extensions/soft-delete.extension.ts
import { Prisma } from '@prisma/client';
import { SOFT_DELETE_MODELS } from '@/database/constants';

export const softDeleteExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      async findUnique({ args, query, model }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = args.where || {};
          const where = args.where as Record<string, unknown>;
          if (where.deletedAt === undefined) {
            where.deletedAt = null;
          }
        }
        return query(args);
      },
      async findFirst({ args, query, model }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = args.where || {};
          const where = args.where as Record<string, unknown>;
          if (where.deletedAt === undefined) {
            where.deletedAt = null;
          }
        }
        return query(args);
      },
      async findMany({ args, query, model }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = args.where || {};
          const where = args.where as Record<string, unknown>;
          if (where.deletedAt === undefined) {
            where.deletedAt = null;
          }
        }
        return query(args);
      },
    },
  },
});
