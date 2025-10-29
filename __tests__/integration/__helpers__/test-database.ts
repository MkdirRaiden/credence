// __tests__/integration/__helpers__/test-database.ts
import { PrismaService } from '@/database/prisma.service';

export async function cleanupDatabase(prisma: PrismaService) {
  // Clean up in reverse order of foreign key dependencies
  await prisma.user.deleteMany({});
  // Add more cleanup as you add tables
}

export async function disconnectDatabase(prisma: PrismaService) {
  await prisma.$disconnect();
}
