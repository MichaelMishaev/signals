import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addUrduTranslations() {
  console.log('Adding Urdu translations to signals...');

  // Update signal with ID 1 (Test Signal from Admin)
  const { data: signal1, error: error1 } = await supabase
    .from('signals')
    .update({
      title_ur: 'ٹیسٹ سگنل منتظم سے',
      content_ur: 'ڈیٹا بیس کنکشن کی جانچ',
      author_ur: 'احمد علی'
    })
    .eq('id', 1)
    .select();

  if (error1) {
    console.error('Error updating signal 1:', error1);
  } else {
    console.log('Updated signal 1:', signal1);
  }

  // Update USD/CAD signal
  const { data: usdcadSignals, error: error2 } = await supabase
    .from('signals')
    .select('*')
    .ilike('title', '%USD/CAD%');

  if (usdcadSignals && usdcadSignals.length > 0) {
    for (const signal of usdcadSignals) {
      const { data, error } = await supabase
        .from('signals')
        .update({
          title_ur: 'USD/CAD فروخت کا موقع - تیل کی قیمت میں اضافہ',
          content_ur: 'کینیڈین ڈالر تیل کی بڑھتی قیمتوں پر مضبوط ہو رہا ہے۔ USD/CAD 1.3500 پر سپورٹ سے نیچے ٹوٹ رہا ہے۔ ہدف 1.3400 ہے 1.3550 پر سٹاپ کے ساتھ۔',
          author_ur: 'احمد علی'
        })
        .eq('id', signal.id)
        .select();

      if (error) {
        console.error(`Error updating signal ${signal.id}:`, error);
      } else {
        console.log(`Updated USD/CAD signal ${signal.id}:`, data);
      }
    }
  }

  // Get all signals without Urdu translations
  const { data: signalsWithoutUrdu, error: error3 } = await supabase
    .from('signals')
    .select('*')
    .is('title_ur', null);

  if (signalsWithoutUrdu && signalsWithoutUrdu.length > 0) {
    console.log(`Found ${signalsWithoutUrdu.length} signals without Urdu translations`);

    for (const signal of signalsWithoutUrdu) {
      // Simple translation: Replace BUY/SELL and add Urdu author
      let title_ur = signal.title;
      let content_ur = signal.content;

      if (signal.action === 'BUY') {
        title_ur = signal.title.replace(/BUY/gi, 'خریداری');
        content_ur = `${signal.pair} کے لیے خریداری کا سگنل۔ ${signal.content}`;
      } else if (signal.action === 'SELL') {
        title_ur = signal.title.replace(/SELL/gi, 'فروخت');
        content_ur = `${signal.pair} کے لیے فروخت کا سگنل۔ ${signal.content}`;
      }

      const { data, error } = await supabase
        .from('signals')
        .update({
          title_ur,
          content_ur,
          author_ur: 'تجزیہ کار'
        })
        .eq('id', signal.id)
        .select();

      if (error) {
        console.error(`Error updating signal ${signal.id}:`, error);
      } else {
        console.log(`Updated signal ${signal.id} with Urdu translation`);
      }
    }
  }

  console.log('Urdu translations added successfully!');
}

addUrduTranslations().catch(console.error);
