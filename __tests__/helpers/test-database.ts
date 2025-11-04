// __tests__/integration/helpers/test-database.ts
import { PrismaService } from '@/database/prisma.service';

/**
 * Cleans up database by deleting test records.
 */
export async function cleanupDatabase(
  prisma: PrismaService | undefined,
): Promise<void> {
  if (!prisma) return;

  try {
    await prisma.user.deleteMany({});
    // Add other models as you grow
  } catch (err) {
    console.error('Database cleanup error:', err);
    throw err;
  }
}

/**
 * Disconnects from database gracefully.
 */
export async function disconnectDatabase(
  prisma: PrismaService | undefined,
): Promise<void> {
  if (!prisma) return;

  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Database disconnect error:', err);
    throw err;
  }
}
