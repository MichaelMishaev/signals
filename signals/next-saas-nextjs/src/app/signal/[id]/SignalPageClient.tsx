'use client';

import EmailGateWrapper from '@/components/shared/emailGate/EmailGateWrapper';
import SignalDetailAnalytics from '@/components/shared/signalDrill/SignalDetailAnalytics';

interface Signal {
  id: number;
  type: string;
  title: string;
  content: string;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  currentPrice: number;
  confidence: number;
  market: string;
  status: string;
  pips: number;
  author: string;
  authorImage: string;
  publishDate: string;
  keyLevels: {
    resistance: number[];
    support: number[];
  };
  chartImage?: string;
  analystStats?: {
    successRate: number;
    totalSignals: number;
    totalPips: number;
  };
}

interface SignalPageClientProps {
  signal: Signal;
  signalId: string;
}

export default function SignalPageClient({ signal, signalId }: SignalPageClientProps) {
  return (
    <EmailGateWrapper
      source={`signal_${signalId}`}
      title="Access Premium Signal Analysis"
      subtitle="Get instant access to detailed trading signals and live market analysis">
      <div className="min-h-screen bg-background-1 dark:bg-background-8">
        <SignalDetailAnalytics signal={signal} />
      </div>
    </EmailGateWrapper>
  );
}
