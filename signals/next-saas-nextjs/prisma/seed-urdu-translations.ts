import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding Urdu translations to signals and drills...');

  // Get all signals
  const signals = await prisma.signal.findMany();

  for (const signal of signals) {
    // Generate Urdu translations
    const title_ur = translateToUrdu(signal.title);
    const content_ur = translateToUrdu(signal.content);
    const author_ur = translateToUrdu(signal.author);

    await prisma.signal.update({
      where: { id: signal.id },
      data: {
        title_ur,
        content_ur,
        author_ur,
      },
    });

    console.log(`✅ Updated Signal ${signal.id}: ${signal.pair}`);
  }

  // Get all drills
  const drills = await prisma.drill.findMany();

  for (const drill of drills) {
    const title_ur = translateToUrdu(drill.title);
    const description_ur = translateToUrdu(drill.description);
    const content_ur = translateToUrdu(drill.content);

    await prisma.drill.update({
      where: { id: drill.id },
      data: {
        title_ur,
        description_ur,
        content_ur,
      },
    });

    console.log(`✅ Updated Drill ${drill.id}: ${drill.title}`);
  }

  console.log(`\n🎉 Complete! Updated ${signals.length} signals and ${drills.length} drills with Urdu translations.`);
}

// Simple translation helper (you can replace with actual translations)
function translateToUrdu(text: string): string {
  // Common trading terms translations
  const translations: Record<string, string> = {
    // Actions
    'BUY': 'خریدیں',
    'SELL': 'بیچیں',
    'Buy': 'خریدیں',
    'Sell': 'بیچیں',

    // Common terms
    'Signal': 'سگنل',
    'Bitcoin': 'بٹ کوائن',
    'Ethereum': 'ایتھیریم',
    'Strong': 'مضبوط',
    'Uptrend': 'اضافے کا رجحان',
    'Downtrend': 'کمی کا رجحان',
    'Bullish': 'تیزی',
    'Bearish': 'منفی',
    'Entry': 'داخلہ',
    'Stop Loss': 'نقصان روکیں',
    'Take Profit': 'منافع لیں',
    'Market': 'مارکیٹ',
    'Analysis': 'تجزیہ',
    'Strategy': 'حکمت عملی',
    'Trading': 'تجارت',
    'Crypto': 'کرپٹو',
    'Cryptocurrency': 'کریپٹو کرنسی',
    'Price': 'قیمت',
    'Support': 'سپورٹ',
    'Resistance': 'مزاحمت',
    'Level': 'سطح',
    'Technical': 'تکنیکی',
    'Fundamental': 'بنیادی',
    'Chart': 'چارٹ',
    'Pattern': 'نمونہ',
    'Trend': 'رجحان',
    'Volume': 'حجم',
    'Momentum': 'رفتار',
    'Indicator': 'اشارہ',
    'Moving Average': 'حرکت پذیر اوسط',
    'RSI': 'آر ایس آئی',
    'MACD': 'ایم اے سی ڈی',
    'Breakout': 'بریک آؤٹ',
    'Reversal': 'تبدیلی',
    'Consolidation': 'استحکام',
    'Opportunity': 'موقع',
    'Risk': 'خطرہ',
    'Reward': 'انعام',
    'Position': 'پوزیشن',
    'Long': 'لانگ',
    'Short': 'شارٹ',
    'Trade': 'تجارت',
    'Profit': 'منافع',
    'Loss': 'نقصان',
    'Target': 'ہدف',
    'Zone': 'زون',
    'Area': 'علاقہ',
    'High': 'اونچا',
    'Low': 'نیچا',
    'Close': 'بند',
    'Open': 'کھلا',
    'Hour': 'گھنٹہ',
    'Day': 'دن',
    'Week': 'ہفتہ',
    'Month': 'مہینہ',
    'Year': 'سال',
    'Time': 'وقت',
    'Date': 'تاریخ',
    'Current': 'موجودہ',
    'Previous': 'پچھلا',
    'Next': 'اگلا',
    'Now': 'اب',
    'Today': 'آج',
    'Yesterday': 'کل',
    'Tomorrow': 'کل',
    'This': 'یہ',
    'That': 'وہ',
    'The': '',
    'A': 'ایک',
    'An': 'ایک',
    'And': 'اور',
    'Or': 'یا',
    'With': 'کے ساتھ',
    'For': 'کے لیے',
    'In': 'میں',
    'On': 'پر',
    'At': 'پر',
    'To': 'کو',
    'From': 'سے',
    'By': 'کی طرف سے',
    'Is': 'ہے',
    'Are': 'ہیں',
    'Was': 'تھا',
    'Were': 'تھے',
    'Be': 'ہو',
    'Been': 'رہا',
    'Being': 'ہونا',
    'Have': 'ہے',
    'Has': 'ہے',
    'Had': 'تھا',
    'Will': 'گا',
    'Would': 'گا',
    'Can': 'سکتا',
    'Could': 'سکتا',
    'Should': 'چاہیے',
    'May': 'ہو سکتا',
    'Might': 'ہو سکتا',
    'Must': 'ضرور',
    'Need': 'ضرورت',
    'Want': 'چاہتے',
    'Like': 'پسند',
    'Get': 'حاصل',
    'Got': 'ملا',
    'Make': 'بنانا',
    'Made': 'بنایا',
    'Go': 'جانا',
    'Went': 'گیا',
    'Come': 'آنا',
    'Came': 'آیا',
    'See': 'دیکھنا',
    'Saw': 'دیکھا',
    'Know': 'جاننا',
    'Knew': 'جانتا',
    'Think': 'سوچنا',
    'Thought': 'سوچا',
    'Take': 'لینا',
    'Took': 'لیا',
    'Find': 'تلاش',
    'Found': 'ملا',
    'Give': 'دینا',
    'Gave': 'دیا',
    'Tell': 'بتانا',
    'Told': 'بتایا',
    'Work': 'کام',
    'Worked': 'کام کیا',
    'Call': 'کال',
    'Called': 'کال کی',
    'Try': 'کوشش',
    'Tried': 'کوشش کی',
    'Ask': 'پوچھنا',
    'Asked': 'پوچھا',
    'Use': 'استعمال',
    'Used': 'استعمال کیا',
    'Feel': 'محسوس',
    'Felt': 'محسوس کیا',
    'Leave': 'چھوڑنا',
    'Left': 'چھوڑ دیا',
    'Put': 'رکھنا',
    'Keep': 'رکھنا',
    'Kept': 'رکھا',
    'Let': 'دینا',
    'Begin': 'شروع',
    'Began': 'شروع کیا',
    'Start': 'شروع',
    'Started': 'شروع کیا',
    'Show': 'دکھانا',
    'Showed': 'دکھایا',
    'Hear': 'سننا',
    'Heard': 'سنا',
    'Play': 'کھیلنا',
    'Played': 'کھیلا',
    'Run': 'چلانا',
    'Ran': 'چلایا',
    'Move': 'منتقل',
    'Moved': 'منتقل کیا',
    'Live': 'رہنا',
    'Lived': 'رہا',
    'Believe': 'یقین',
    'Believed': 'یقین کیا',
    'Bring': 'لانا',
    'Brought': 'لایا',
    'Happen': 'ہونا',
    'Happened': 'ہوا',
    'Write': 'لکھنا',
    'Wrote': 'لکھا',
    'Provide': 'فراہم',
    'Provided': 'فراہم کیا',
    'Sit': 'بیٹھنا',
    'Sat': 'بیٹھا',
    'Stand': 'کھڑا',
    'Stood': 'کھڑا تھا',
    'Lose': 'کھونا',
    'Lost': 'کھو دیا',
    'Pay': 'ادائیگی',
    'Paid': 'ادا کی',
    'Meet': 'ملنا',
    'Met': 'ملا',
    'Include': 'شامل',
    'Included': 'شامل کیا',
    'Continue': 'جاری',
    'Continued': 'جاری رکھا',
    'Set': 'سیٹ',
    'Learn': 'سیکھنا',
    'Learned': 'سیکھا',
    'Change': 'تبدیلی',
    'Changed': 'تبدیل کیا',
    'Lead': 'رہنمائی',
    'Led': 'رہنمائی کی',
    'Understand': 'سمجھنا',
    'Understood': 'سمجھا',
    'Watch': 'دیکھنا',
    'Watched': 'دیکھا',
    'Follow': 'پیروی',
    'Followed': 'پیروی کی',
    'Stop': 'رکنا',
    'Stopped': 'رک گیا',
    'Create': 'بنانا',
    'Created': 'بنایا',
    'Speak': 'بولنا',
    'Spoke': 'بولا',
    'Read': 'پڑھنا',
    'Reach': 'پہنچنا',
    'Reached': 'پہنچا',
    'Spend': 'خرچ',
    'Spent': 'خرچ کیا',
    'Grow': 'بڑھنا',
    'Grew': 'بڑھا',
    'Pass': 'گزرنا',
    'Passed': 'گزرا',
    'Sell': 'بیچنا',
    'Sold': 'بیچا',
    'Require': 'ضرورت',
    'Required': 'ضرورت تھی',
    'Report': 'رپورٹ',
    'Reported': 'رپورٹ کی',
    'Decide': 'فیصلہ',
    'Decided': 'فیصلہ کیا',
    'Pull': 'کھینچنا',
    'Pulled': 'کھینچا',
  };

  let translated = text;

  // Replace known terms
  for (const [en, ur] of Object.entries(translations)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, ur);
  }

  // If no translation found or very short, add a prefix
  if (translated === text || translated.trim().length < 10) {
    return `[اردو] ${text}`;
  }

  return translated;
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
