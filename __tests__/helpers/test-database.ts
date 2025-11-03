// __tests__/integration/__helpers__/test-database.ts
import { PrismaService } from '@/database/prisma.service';

export async function cleanupDatabase(prisma: PrismaService | undefined) {
  if (!prisma) return;
  try {
    if (prisma?.user) {
      await prisma.user.deleteMany({});
    }
  } catch (err) {
    console.error('Database cleanup error:', err);
  }
}

export async function disconnectDatabase(prisma: PrismaService | undefined) {
  if (!prisma) return;
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error('Database disconnect error:', err);
  }
}
