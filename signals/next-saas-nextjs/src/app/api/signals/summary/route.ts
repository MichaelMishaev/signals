import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();

    // Fetch the latest 3 signals directly from Supabase (avoid internal HTTP call)
    const supabaseAdmin = getSupabaseAdmin();

    let signals: any[] = [];

    if (!supabaseAdmin) {
      console.error('Supabase not configured - cannot fetch signals');
      return NextResponse.json({
        summary: locale === 'ur'
          ? 'سگنلز لوڈ کرنے میں مسئلہ ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔'
          : 'Unable to load signals at the moment. Please try again later.',
      });
    }

    // Fetch directly from database
    const { data, error } = await supabaseAdmin
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error || !data) {
      console.error('Failed to fetch signals from database:', error);
      return NextResponse.json({
        summary: locale === 'ur'
          ? 'سگنلز لوڈ کرنے میں مسئلہ ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔'
          : 'Unable to load signals at the moment. Please try again later.',
      });
    }

    signals = data;

    if (!signals || signals.length === 0) {
      return NextResponse.json({
        summary: locale === 'ur'
          ? 'ابھی کوئی سگنل دستیاب نہیں ہیں۔'
          : 'No signals available at the moment.',
      });
    }

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback: Generate a simple summary without AI
      const fallbackSummary = generateFallbackSummary(signals, locale);
      return NextResponse.json({ summary: fallbackSummary });
    }

    // Prepare signal data for GPT-4o-mini
    const signalData = signals.map((s: any) => ({
      pair: s.pair,
      action: s.action,
      entry: s.entry,
      stopLoss: s.stop_loss,
      takeProfit: s.take_profit,
      confidence: s.confidence,
      market: s.market,
      title: s.title,
    }));

    const prompt = locale === 'ur'
      ? `آپ ایک پیشہ ور ٹریڈنگ تجزیہ کار ہیں۔ مندرجہ ذیل 3 تازہ ترین ٹریڈنگ سگنلز کا مختصر خلاصہ فراہم کریں (زیادہ سے زیادہ 150 الفاظ):\n\n${JSON.stringify(signalData, null, 2)}\n\nمارکیٹ کے رجحانات، رسک لیولز، اور ممکنہ منافع پر توجہ دیں۔ اردو میں جواب دیں۔`
      : `You are a professional trading analyst. Provide a brief summary of the following 3 latest trading signals (maximum 150 words):\n\n${JSON.stringify(signalData, null, 2)}\n\nFocus on market trends, risk levels, and potential opportunities. Keep it concise and actionable.`;

    // Call OpenAI API with GPT-4o-mini
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: locale === 'ur'
              ? 'آپ ایک پیشہ ور ٹریڈنگ تجزیہ کار ہیں جو مختصر اور واضح خلاصے فراہم کرتے ہیں۔'
              : 'You are a professional trading analyst who provides concise and clear summaries.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text());
      // Fallback to simple summary
      const fallbackSummary = generateFallbackSummary(signals, locale);
      return NextResponse.json({ summary: fallbackSummary });
    }

    const data = await openaiResponse.json();
    const summary = data.choices[0]?.message?.content || '';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);

    // Return a graceful fallback instead of 500 error
    const locale = 'en'; // Default to English since we couldn't parse the request
    return NextResponse.json({
      summary: locale === 'ur'
        ? 'خلاصہ بنانے میں مسئلہ۔ براہ کرم بعد میں کوشش کریں۔'
        : 'Unable to generate summary at this time. Please try again later.',
    }, { status: 200 }); // Return 200 with fallback message instead of 500
  }
}

// Fallback summary generator (without AI)
function generateFallbackSummary(signals: any[], locale: string): string {
  if (locale === 'ur') {
    const summary = signals.map((s: any, i: number) =>
      `${i + 1}. ${s.pair} - ${s.action === 'BUY' ? 'خریداری' : 'فروخت'} @ ${s.entry} (اعتماد: ${s.confidence}%)`
    ).join('\n');

    return `📊 تازہ ترین 3 سگنلز:\n\n${summary}\n\nنوٹ: تفصیلی تجزیہ کے لیے OpenAI API کی ضرورت ہے۔`;
  }

  const summary = signals.map((s: any, i: number) =>
    `${i + 1}. ${s.pair} - ${s.action} @ ${s.entry} (Confidence: ${s.confidence}%)`
  ).join('\n');

  return `📊 Latest 3 Signals:\n\n${summary}\n\nNote: Detailed analysis requires OpenAI API configuration.`;
}
