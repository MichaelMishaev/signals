import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { locale } = await request.json();

    // Fetch the latest 3 signals
    const signalsResponse = await fetch(`${request.nextUrl.origin}/api/signals?limit=3`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!signalsResponse.ok) {
      throw new Error('Failed to fetch signals');
    }

    const { signals } = await signalsResponse.json();

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
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
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
