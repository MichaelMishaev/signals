#!/usr/bin/env node
/**
 * Import Signals from JSON to Production Database
 *
 * Usage:
 *   node import-signals-from-json.js <file.json>
 *   node import-signals-from-json.js signals.json
 *
 * JSON Format:
 * [
 *   {
 *     "title": "Signal Title",
 *     "title_ur": "اردو عنوان",
 *     "content": "Description...",
 *     "content_ur": "اردو تفصیل...",
 *     "pair": "EUR/USD",
 *     "action": "BUY",
 *     "entry": 1.0850,
 *     "stop_loss": 1.0820,
 *     "take_profit": 1.0920,
 *     "confidence": 87,
 *     "market": "FOREX",
 *     "status": "ACTIVE",
 *     "priority": "HIGH",
 *     "author": "Name",
 *     "author_ur": "نام",
 *     "published_date": "2025-10-10T12:00:00.000Z"
 *   }
 * ]
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Production Supabase Database URL
const DATABASE_URL = process.env.DATABASE_URL ||
  "postgresql://postgres.avxygvzqfyxpzdxwmefe:Jtbdtjtb6262@aws-1-eu-central-1.pooler.supabase.com:6543/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: { url: DATABASE_URL }
  }
});

async function importSignals() {
  console.log('\n📥 Signals JSON Import Tool');
  console.log('============================\n');

  // Get filename from command line
  const filename = process.argv[2];

  if (!filename) {
    console.error('❌ Error: Please provide a JSON file path');
    console.log('\nUsage: node import-signals-from-json.js <file.json>');
    console.log('Example: node import-signals-from-json.js signals.json\n');
    process.exit(1);
  }

  // Check if file exists
  if (!fs.existsSync(filename)) {
    console.error(`❌ Error: File not found: ${filename}\n`);
    process.exit(1);
  }

  try {
    // Read and parse JSON file
    console.log(`📂 Reading file: ${filename}`);
    const fileContent = fs.readFileSync(filename, 'utf-8');
    const signals = JSON.parse(fileContent);

    if (!Array.isArray(signals)) {
      console.error('❌ Error: JSON file must contain an array of signals\n');
      process.exit(1);
    }

    console.log(`✅ Found ${signals.length} signals in JSON file\n`);

    // Connect to database
    await prisma.$connect();
    console.log('✅ Connected to production database (Supabase)\n');

    // Ask for confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question('⚠️  Import these signals to PRODUCTION? (y/N): ', resolve);
    });
    rl.close();

    if (answer.toLowerCase() !== 'y') {
      console.log('\n❌ Import cancelled\n');
      process.exit(0);
    }

    // Validate required fields
    console.log('\n🔍 Validating signals...');
    const requiredFields = ['title', 'pair', 'action', 'entry', 'market', 'status'];
    let validSignals = 0;
    let invalidSignals = 0;

    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];
      const missing = requiredFields.filter(field => !signal[field]);

      if (missing.length > 0) {
        console.log(`⚠️  Signal #${i + 1} missing fields: ${missing.join(', ')}`);
        invalidSignals++;
      } else {
        validSignals++;
      }
    }

    console.log(`\n✅ Valid signals: ${validSignals}`);
    console.log(`⚠️  Invalid signals: ${invalidSignals}\n`);

    if (validSignals === 0) {
      console.error('❌ No valid signals to import\n');
      process.exit(1);
    }

    // Import signals
    console.log('📊 Importing signals...\n');
    let imported = 0;
    let failed = 0;

    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];

      // Skip invalid signals
      const missing = requiredFields.filter(field => !signal[field]);
      if (missing.length > 0) {
        failed++;
        continue;
      }

      try {
        // Add timestamps if not present
        const signalData = {
          ...signal,
          published_date: signal.published_date || new Date().toISOString(),
          created_at: signal.created_at || new Date().toISOString(),
          updated_at: signal.updated_at || new Date().toISOString(),
        };

        const created = await prisma.signal.create({
          data: signalData
        });

        imported++;
        console.log(`✅ ${imported}. Imported: ${signal.pair} ${signal.action} - ${signal.title.substring(0, 50)}...`);
      } catch (error) {
        failed++;
        console.error(`❌ Failed to import signal #${i + 1}: ${error.message}`);
      }
    }

    console.log(`\n🎉 Import complete!`);
    console.log(`✅ Successfully imported: ${imported}`);
    console.log(`❌ Failed: ${failed}\n`);

    // Show total count
    const totalSignals = await prisma.signal.count();
    console.log(`📈 Total signals in database: ${totalSignals}\n`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('✅ Database connection closed\n');
  }
}

importSignals();
