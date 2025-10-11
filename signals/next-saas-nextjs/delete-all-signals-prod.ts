import { PrismaClient } from '@prisma/client';

// Production Supabase Database URL
const DATABASE_URL = "postgresql://postgres.avxygvzqfyxpzdxwmefe:Jtbdtjtb6262@aws-1-eu-central-1.pooler.supabase.com:6543/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: { url: DATABASE_URL }
  }
});

async function deleteAllSignals() {
  console.log('\n⚠️  DELETE ALL SIGNALS FROM PRODUCTION');
  console.log('==========================================\n');

  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Connected to production database (Supabase)\n');

    // Count signals before deletion
    const countBefore = await prisma.signal.count();
    console.log(`📊 Current signals in database: ${countBefore}\n`);

    if (countBefore === 0) {
      console.log('ℹ️  No signals to delete\n');
      return;
    }

    // Delete all drills first (foreign key constraint)
    console.log('🗑️  Deleting all drills...');
    const drillsDeleted = await prisma.drill.deleteMany({});
    console.log(`✅ Deleted ${drillsDeleted.count} drills\n`);

    // Delete all signals
    console.log('🗑️  Deleting all signals...');
    const signalsDeleted = await prisma.signal.deleteMany({});
    console.log(`✅ Deleted ${signalsDeleted.count} signals\n`);

    // Verify
    const countAfter = await prisma.signal.count();
    console.log(`📊 Signals remaining: ${countAfter}\n`);

    console.log('✅ Production database is now clean!\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('✅ Database connection closed\n');
  }
}

deleteAllSignals()
  .then(() => {
    console.log('🎉 Complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
