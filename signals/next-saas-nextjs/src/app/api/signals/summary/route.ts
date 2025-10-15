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
    const { data: signalsData, error } = await supabaseAdmin
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error || !signalsData) {
      console.error('Failed to fetch signals from database:', error);
      return NextResponse.json({
        summary: locale === 'ur'
          ? 'سگنلز لوڈ کرنے میں مسئلہ ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔'
          : 'Unable to load signals at the moment. Please try again later.',
      });
    }

    signals = signalsData;

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
      ? `آپ ایک تجربہ کار ٹریڈنگ ماہر ہیں جو پاکستانی تاجروں کی مدد کرتے ہیں۔ مندرجہ ذیل 3 تازہ ترین سگنلز کا ایک واضح اور قابل عمل خلاصہ فراہم کریں:\n\n${JSON.stringify(signalData, null, 2)}\n\nبرائے مہربانی:\n1. ایک مختصر تعارف سے شروع کریں جو مجموعی مارکیٹ کی صورتحال بیان کرے\n2. ہر سگنل کے بارے میں بتائیں (جوڑا، ایکشن، اعتماد کی سطح)\n3. ممکنہ رسک اور فائدے کو واضح کریں\n4. انسانی انداز میں لکھیں - جیسے آپ کسی دوست کو مشورہ دے رہے ہیں\n\nزیادہ سے زیادہ 150 الفاظ میں۔ اردو میں جواب دیں۔`
      : `You are an experienced trading expert helping retail traders understand market opportunities. Please provide a clear, actionable summary of these 3 latest trading signals:\n\n${JSON.stringify(signalData, null, 2)}\n\nPlease:\n1. Start with a brief intro describing the overall market sentiment\n2. Highlight each signal (pair, action, entry point, confidence level) in a conversational way\n3. Explain potential risks and rewards clearly\n4. Write in a professional yet approachable tone - like you're advising a friend\n5. Use numbered lists for the signals for clarity\n\nKeep it under 150 words and make it engaging and easy to understand.`;

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
              ? 'آپ ایک دوستانہ اور تجربہ کار ٹریڈنگ مشیر ہیں۔ آپ پیچیدہ معلومات کو آسان اور قابل فہم انداز میں بیان کرتے ہیں۔ آپ کا مقصد تاجروں کو واضح اور قابل عمل مشورہ دینا ہے۔'
              : 'You are a friendly, experienced trading advisor. You explain complex information in a simple, conversational way that retail traders can easily understand. Your goal is to provide clear, actionable insights while maintaining a professional yet approachable tone.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 400,
        temperature: 0.8,
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
