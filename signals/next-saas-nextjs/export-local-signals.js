const { PrismaClient } = require('@prisma/client');

const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@localhost:5432/signals_db'
    }
  }
});

async function exportSignals() {
  try {
    const signals = await localPrisma.signal.findMany({
      orderBy: { created_at: 'desc' },
      take: 20
    });

    console.log(`\n📊 Found ${signals.length} signals in local database\n`);

    if (signals.length > 0) {
      signals.forEach((signal, index) => {
        console.log(`${index + 1}. [${signal.id}] ${signal.pair} ${signal.action} - ${signal.title.substring(0, 50)}...`);
      });

      // Export as JSON
      const fs = require('fs');
      fs.writeFileSync('local-signals-export.json', JSON.stringify(signals, null, 2));
      console.log('\n✅ Signals exported to local-signals-export.json');
      console.log(`\n📦 Total signals: ${signals.length}`);
    } else {
      console.log('ℹ️  No signals found in local database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'P2021') {
      console.log('\nℹ️  The "signals" table does not exist in local database');
    }
  } finally {
    await localPrisma.$disconnect();
  }
}

exportSignals();
