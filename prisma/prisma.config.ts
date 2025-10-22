import path from 'node:path'
import type { PrismaConfig } from 'prisma'

export default {
  schema: path.join('prisma', 'schema.prisma'), // only merged schema
} satisfies PrismaConfig
