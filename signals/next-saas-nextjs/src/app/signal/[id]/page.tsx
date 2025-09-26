import { notFound } from 'next/navigation';
import SignalPageClient from './SignalPageClient';

// Fetch signal data from our API route (which handles RLS properly)
async function getSignalData(id: string) {
  try {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_SITE_URL
        : `http://localhost:${process.env.PORT || 5001}`;

    const response = await fetch(`${baseUrl}/api/signals/${id}`, {
      // Disable caching for real-time data
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch signal');
    }

    const data = await response.json();

    if (!data || !data.signal) {
      return null;
    }

    const signal = data.signal;

    // Transform database format to component format
    return {
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
      authorImage: signal.author_image || '/images/avatars/default.jpg',
      publishDate: signal.published_date,
      keyLevels: signal.key_levels || {
        resistance: [],
        support: [],
      },
      chartImage: signal.chart_image,
      analystStats: signal.analyst_stats,
    };
  } catch (error) {
    console.error('Error fetching signal data:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SignalDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const signal = await getSignalData(resolvedParams.id);

  if (!signal) {
    notFound();
  }

  return <SignalPageClient signal={signal} signalId={resolvedParams.id} />;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const signal = await getSignalData(resolvedParams.id);

  if (!signal) {
    return {
      title: 'Signal Not Found',
    };
  }

  return {
    title: `${signal.title} - Signal Analysis`,
    description: signal.content,
    keywords: `trading, signals, ${signal.pair}, ${signal.market}, ${signal.action}`,
  };
}
