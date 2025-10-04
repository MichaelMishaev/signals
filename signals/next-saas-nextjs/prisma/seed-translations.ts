import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding translation data...');

  // Sample signal translations
  const translations = [
    {
      content_type: 'signal_title',
      key: 'btc_buy_signal_001',
      en_value: 'Bitcoin Buy Signal - Strong Uptrend',
      ur_value: 'بٹ کوائن خریداری سگنل - مضبوط اضافے کا رجحان',
      ur_status: 'pending',
      ur_updated_at: new Date(),
    },
    {
      content_type: 'signal_description',
      key: 'btc_buy_signal_001_desc',
      en_value: 'Strong bullish momentum detected. Entry at $42,000 with stop loss at $40,500.',
      ur_value: 'مضبوط تیزی کی رفتار کا پتا چلا۔ $42,000 پر داخلہ اور $40,500 پر نقصان روکیں۔',
      ur_status: 'pending',
      ur_updated_at: new Date(),
    },
    {
      content_type: 'signal_title',
      key: 'eth_sell_signal_002',
      en_value: 'Ethereum Sell Signal - Bearish Reversal',
      ur_value: 'ایتھیریم فروخت سگنل - منفی تبدیلی',
      ur_status: 'approved',
      ur_updated_at: new Date(Date.now() - 86400000),
      ur_approved_at: new Date(),
    },
    {
      content_type: 'news',
      key: 'market_update_003',
      en_value: 'Major support level broken - Market entering correction phase',
      ur_value: 'اہم سپورٹ لیول ٹوٹ گیا - مارکیٹ اصلاح کے مرحلے میں داخل',
      ur_status: 'rejected',
      ur_updated_at: new Date(Date.now() - 172800000),
      ur_approved_at: new Date(Date.now() - 86400000),
    },
    {
      content_type: 'drill_title',
      key: 'drill_support_resistance',
      en_value: 'Support and Resistance Trading Strategy',
      ur_value: null,
      ur_status: 'pending',
    },
    {
      content_type: 'analysis',
      key: 'weekly_market_analysis',
      en_value: 'Weekly market shows consolidation pattern with possible breakout',
      ur_value: 'ہفتہ وار مارکیٹ میں استحکام کا نمونہ ممکنہ بریک آؤٹ کے ساتھ',
      ur_status: 'pending',
      ur_updated_at: new Date(),
    },
  ];

  for (const translation of translations) {
    await prisma.translationDynamic.upsert({
      where: { key: translation.key },
      update: translation,
      create: translation,
    });
  }

  console.log('✅ Translation seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding translations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
