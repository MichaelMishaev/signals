import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const signals = [
  {
    title: 'EUR/USD Strong BUY Signal - Bullish Momentum',
    title_ur: 'EUR/USD مضبوط خریداری کا سگنل - تیزی کا رجحان',
    content: 'Technical analysis shows strong bullish momentum with RSI oversold recovery and key support at 1.0820. Multiple indicators confirm upward trend. Expected target at 1.0920 with tight stop loss management for optimal risk-reward ratio.',
    content_ur: 'تکنیکی تجزیہ مضبوط تیزی کا رجحان ظاہر کرتا ہے۔ RSI اوور سولڈ سے بحالی اور 1.0820 پر اہم سپورٹ۔ متعدد اشارے اوپر کے رجحان کی تصدیق کرتے ہیں۔',
    pair: 'EUR/USD',
    action: 'BUY',
    entry: 1.0850,
    stop_loss: 1.0820,
    take_profit: 1.0920,
    confidence: 87,
    market: 'FOREX',
    status: 'ACTIVE',
    priority: 'HIGH',
    author: 'Ahmad Ali',
    author_ur: 'احمد علی',
    published_date: new Date().toISOString(),
  },
  {
    title: 'GBP/USD Breakout - Strong Buy Opportunity',
    title_ur: 'GBP/USD بریک آؤٹ - مضبوط خریداری کا موقع',
    content: 'British Pound showing exceptional strength against USD. Key resistance broken at 1.2650 with strong volume confirmation. Technical setup suggests continuation to 1.2750 target.',
    content_ur: 'برطانوی پاؤنڈ USD کے مقابلے میں غیر معمولی طاقت دکھا رہا ہے۔ 1.2650 پر اہم مزاحمت ٹوٹ گئی۔',
    pair: 'GBP/USD',
    action: 'BUY',
    entry: 1.2675,
    stop_loss: 1.2640,
    take_profit: 1.2750,
    confidence: 82,
    market: 'FOREX',
    status: 'ACTIVE',
    priority: 'HIGH',
    author: 'Sarah Mitchell',
    author_ur: 'سارہ مچل',
    published_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    title: 'USD/PKR Sell Signal - Rupee Strength Expected',
    title_ur: 'USD/PKR فروخت کا سگنل - روپے میں مضبوطی کی توقع',
    content: 'Pakistani Rupee showing signs of recovery amid positive economic indicators. Central bank interventions creating support. Technical indicators suggest USD weakness against PKR in short term.',
    content_ur: 'پاکستانی روپیہ مثبت اقتصادی اشاریوں کے درمیان بحالی کے آثار دکھا رہا ہے۔',
    pair: 'USD/PKR',
    action: 'SELL',
    entry: 285.20,
    stop_loss: 286.50,
    take_profit: 283.00,
    confidence: 75,
    market: 'FOREX',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    author: 'Fatima Khan',
    author_ur: 'فاطمہ خان',
    published_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    title: 'BTC/USDT Bullish Breakout - Crypto Rally Continues',
    title_ur: 'BTC/USDT تیزی کا بریک آؤٹ - کرپٹو ریلی جاری',
    content: 'Bitcoin breaking above key resistance with massive volume surge. Institutional buying evident. Strong bullish momentum suggests move towards $46,500. Risk management essential given crypto volatility.',
    content_ur: 'بٹ کوائن بڑے حجم کے اضافے کے ساتھ اہم مزاحمت سے اوپر جا رہا ہے۔',
    pair: 'BTC/USDT',
    action: 'BUY',
    entry: 45000,
    stop_loss: 44500,
    take_profit: 46500,
    confidence: 91,
    market: 'CRYPTO',
    status: 'ACTIVE',
    priority: 'HIGH',
    author: 'Ahmad Ali',
    author_ur: 'احمد علی',
    published_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    title: 'ETH/USDT Strong Buy - Ethereum Leading Altcoins',
    title_ur: 'ETH/USDT مضبوط خریداری - ایتھیریم آلٹ کوائنز میں سرفہرست',
    content: 'Ethereum showing leadership in altcoin market. Technical breakout confirmed with RSI bullish divergence. DeFi sector strength supporting upward momentum.',
    content_ur: 'ایتھیریم آلٹ کوائن مارکیٹ میں قیادت دکھا رہا ہے۔ تکنیکی بریک آؤٹ کی تصدیق۔',
    pair: 'ETH/USDT',
    action: 'BUY',
    entry: 2450,
    stop_loss: 2400,
    take_profit: 2550,
    confidence: 84,
    market: 'CRYPTO',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    author: 'Zara Bhatti',
    author_ur: 'زارا بھٹی',
    published_date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
  {
    title: 'Gold (XAU/USD) Safe Haven Buy - Geopolitical Tensions',
    title_ur: 'سونا (XAU/USD) محفوظ پناہ گاہ خریداری - جغرافیائی کشیدگی',
    content: 'Gold breaking above $2000 resistance amid rising geopolitical tensions. Safe haven demand surging. Technical indicators strongly bullish with multiple support levels confirmed.',
    content_ur: 'جغرافیائی کشیدگی میں اضافے کے درمیان سونا $2000 مزاحمت سے اوپر جا رہا ہے۔',
    pair: 'XAU/USD',
    action: 'BUY',
    entry: 2005.50,
    stop_loss: 1995.00,
    take_profit: 2025.00,
    confidence: 85,
    market: 'COMMODITIES',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    author: 'Sarah Mitchell',
    author_ur: 'سارہ مچل',
    published_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    title: 'OGDC Strong Buy - Pakistan Stock Exchange Leader',
    title_ur: 'OGDC مضبوط خریداری - پاکستان اسٹاک ایکسچینج کا لیڈر',
    content: 'Oil & Gas Development Company showing strong bullish patterns. Breakout above 92.50 PKR confirmed with high volume. Energy sector leading PSX gains. Target 97.50 PKR.',
    content_ur: 'آئل اینڈ گیس ڈیولپمنٹ کمپنی مضبوط تیزی کے نمونے دکھا رہی ہے۔',
    pair: 'OGDC',
    action: 'BUY',
    entry: 92.50,
    stop_loss: 90.00,
    take_profit: 97.50,
    confidence: 82,
    market: 'PSX',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    author: 'Omar Sheikh',
    author_ur: 'عمر شیخ',
    published_date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
  },
  {
    title: 'HBL Bank Buy Signal - Banking Sector Strength',
    title_ur: 'HBL بینک خریداری کا سگنل - بینکنگ سیکٹر کی طاقت',
    content: 'Habib Bank Limited showing strong technical setup. Banking sector leading PSX index gains. Earnings report expectations positive. Conservative target with solid risk-reward.',
    content_ur: 'حبیب بینک لمیٹڈ مضبوط تکنیکی سیٹ اپ دکھا رہا ہے۔ بینکنگ سیکٹر PSX انڈیکس میں سرفہرست۔',
    pair: 'HBL',
    action: 'BUY',
    entry: 185.50,
    stop_loss: 182.00,
    take_profit: 192.00,
    confidence: 78,
    market: 'PSX',
    status: 'ACTIVE',
    priority: 'LOW',
    author: 'Fatima Khan',
    author_ur: 'فاطمہ خان',
    published_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    title: 'USD/JPY Sell Signal - Yen Strength Emerging',
    title_ur: 'USD/JPY فروخت کا سگنل - ین کی طاقت ابھر رہی ہے',
    content: 'Japanese Yen showing strength as safe haven demand increases. Technical indicators suggest USD weakness. Bank of Japan policy expectations supporting Yen recovery.',
    content_ur: 'جاپانی ین طاقت دکھا رہا ہے کیونکہ محفوظ پناہ گاہ کی طلب بڑھ رہی ہے۔',
    pair: 'USD/JPY',
    action: 'SELL',
    entry: 149.50,
    stop_loss: 150.20,
    take_profit: 148.00,
    confidence: 73,
    market: 'FOREX',
    status: 'ACTIVE',
    priority: 'LOW',
    author: 'Ahmad Ali',
    author_ur: 'احمد علی',
    published_date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
  },
  {
    title: 'AUD/USD Buy Opportunity - Commodity Currency Rally',
    title_ur: 'AUD/USD خریداری کا موقع - کموڈٹی کرنسی ریلی',
    content: 'Australian Dollar benefiting from commodity price strength. Technical setup bullish with multiple confirmations. RBA policy stance supportive for further AUD gains.',
    content_ur: 'آسٹریلوی ڈالر اجناس کی قیمتوں کی مضبوطی سے فائدہ اٹھا رہا ہے۔',
    pair: 'AUD/USD',
    action: 'BUY',
    entry: 0.6650,
    stop_loss: 0.6620,
    take_profit: 0.6720,
    confidence: 76,
    market: 'FOREX',
    status: 'ACTIVE',
    priority: 'LOW',
    author: 'Zara Bhatti',
    author_ur: 'زارا بھٹی',
    published_date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
  }
];

async function seedProduction() {
  console.log('🌱 Starting production database seed...\n');

  try {
    // Check connection
    await prisma.$connect();
    console.log('✅ Connected to database\n');

    // Clear existing signals (optional - comment out if you want to keep existing data)
    const deleteResult = await prisma.signal.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.count} existing signals\n`);

    // Insert signals
    console.log('📊 Inserting signals...\n');
    let insertedCount = 0;

    for (const signal of signals) {
      try {
        const created = await prisma.signal.create({
          data: signal
        });
        insertedCount++;
        console.log(`✅ ${insertedCount}. Created signal: ${signal.pair} ${signal.action} (ID: ${created.id})`);
      } catch (error: any) {
        console.error(`❌ Failed to create signal ${signal.pair}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully seeded ${insertedCount} signals!`);

    // Verify
    const totalSignals = await prisma.signal.count();
    console.log(`\n📈 Total signals in database: ${totalSignals}`);

  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Database connection closed');
  }
}

seedProduction()
  .then(() => {
    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  });
