// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { seedUsers } from './factories/user.factory';

const prisma = new PrismaClient();

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  console.log(`🌱 Starting database seed for ${environment}...`);

  if (environment === 'development' || environment === 'test') {
    console.log('🗑️  Cleaning up existing data...');
    await prisma.user.deleteMany({});
  }

  console.log('👥 Seeding users...');
  for (const userData of seedUsers) {
    const user = await prisma.user.create({ data: userData });
    console.log(`   ✓ Created user: ${user.email}`);
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
