'use client';

import EmailGateWrapper from '@/components/shared/emailGate/EmailGateWrapper';
import SignalDetailAnalytics from '@/components/shared/signalDrill/SignalDetailAnalytics';

interface Signal {
  id: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
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
