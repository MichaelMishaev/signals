import { notFound } from 'next/navigation';
import SignalPageClient from './SignalPageClient';

// Fetch signal data and associated drills
async function getSignalData(id: string, locale: string) {
  try {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SITE_URL
        : `http://localhost:${process.env.PORT || 5001}`;

    // Fetch signal data with locale
    const signalResponse = await fetch(`${baseUrl}/api/signals/${id}?locale=${locale}`, {
      cache: 'no-store',
    });

    if (!signalResponse.ok) {
      throw new Error('Failed to fetch signal');
    }

    const signalData = await signalResponse.json();

    if (!signalData || !signalData.signal) {
      return null;
    }

    // Fetch associated drills
    const drillsResponse = await fetch(`${baseUrl}/api/drills?signal_id=${id}`, {
      cache: 'no-store',
    });

    let drills = [];
    if (drillsResponse.ok) {
      const drillsData = await drillsResponse.json();
      drills = drillsData.drills || [];
    }

    const signal = signalData.signal;

    // Transform database format to component format
    return {
      signal: {
        id: signal.id,
        type: 'SIGNAL',
        title: signal.title,
        content: signal.content,
        pair: signal.pair,
        action: signal.action,
        entry: signal.entry,
        stopLoss: signal.stop_loss,
        takeProfit: signal.take_profit,
        currentPrice: signal.current_price,
        confidence: signal.confidence,
        market: signal.market,
        status: signal.status,
        pips: signal.pips,
        author: signal.author,
        authorImage: signal.author_image || '/images/avatar/avatar-1.png',
        publishDate: signal.published_date,
        keyLevels: signal.key_levels &&
          (signal.key_levels.resistance?.length > 0 || signal.key_levels.support?.length > 0)
          ? signal.key_levels
          : undefined,
        chartImage: signal.chart_image,
        analystStats: signal.analyst_stats,
      },
      drills: drills
    };
  } catch (error) {
    console.error('Error fetching signal data:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function SignalDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getSignalData(resolvedParams.id, resolvedParams.locale);

  if (!data) {
    notFound();
  }

  return <SignalPageClient signal={data.signal} drills={data.drills} signalId={resolvedParams.id} />;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getSignalData(resolvedParams.id, resolvedParams.locale);

  if (!data) {
    return {
      title: 'Signal Not Found',
    };
  }

  return {
    title: `${data.signal.title} - Signal Analysis`,
    description: data.signal.content,
    keywords: `trading, signals, ${data.signal.pair}, ${data.signal.market}, ${data.signal.action}`,
  };
}
