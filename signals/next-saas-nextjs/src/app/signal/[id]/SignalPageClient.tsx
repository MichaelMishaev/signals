'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EmailGateWrapper from '@/components/shared/emailGate/EmailGateWrapper';
import SignalDetailAnalytics from '@/components/shared/signalDrill/SignalDetailAnalytics';
import { ActionButton } from '@/components/shared/sharedbuttons';
import { useRandomPopup } from '@/components/shared/popups';

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

interface Drill {
  id: number;
  signal_id: number;
  title: string;
  description: string;
  type: 'CASE_STUDY' | 'ANALYTICS' | 'BLOG';
  content: string;
  order_index: number;
  is_active: boolean;
  image_url?: string;
  created_at: string;
}

interface SignalPageClientProps {
  signal: Signal;
  drills: Drill[];
  signalId: string;
}

export default function SignalPageClient({ signal, drills, signalId }: SignalPageClientProps) {
  const [activeTab, setActiveTab] = useState<string>(drills.length > 0 ? drills[0].type : 'overview');
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);

  // Random Popup Hook
  const { showPopup: showRandomPopup, PopupComponent: RandomPopup } = useRandomPopup();

  // Handler to start the trading flow
  const handleStartTrading = () => {
    const now = Date.now();
    localStorage.setItem('tradingStartTime', now.toString());
    setButtonPressed(true);
  };

  // Check if user has email in localStorage (from EmailGateWrapper)
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const tradingStartTime = localStorage.getItem('tradingStartTime');

    // If user has email but hasn't started the trading flow yet
    if (userEmail && !tradingStartTime) {
      // Start the timer when they view a drill page
      handleStartTrading();
    }
  }, [handleStartTrading]);

  // Show random popup after delay
  useEffect(() => {
    // Show random popup after 5 seconds on page
    const timer = setTimeout(() => {
      showRandomPopup();
    }, 5000);

    // Optional: Show another popup after 30 seconds
    const timer2 = setTimeout(() => {
      showRandomPopup();
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [showRandomPopup]);

  // If no drills available, show the legacy analytics view
  if (!drills || drills.length === 0) {
    return (
      <EmailGateWrapper
        source={`signal_${signalId}`}
        title="Access Premium Signal Analysis"
        subtitle="Get instant access to detailed trading signals and live market analysis">
        <div className="min-h-screen bg-background-1 dark:bg-background-8 pb-24">
          <SignalDetailAnalytics signal={signal} />
        </div>

        {/* Sticky Action Button for Analytics View */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/95 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900/95 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-5 z-40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
              <div className="hidden sm:block flex-1">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Educational content • Risk disclosure applies
                </p>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]">
                <ActionButton
                  variant={['urgent-countdown', 'live-pulse', 'profit-alert', 'rocket-launch'][signal.id % 4] as any}
                  onClick={() => {
                    // Start the trading flow if not already started
                    if (!buttonPressed) {
                      handleStartTrading();
                    }
                    // Navigate to external trading platform
                    window.open('https://platform.example.com/trade', '_blank');
                    console.log(`Opening trade for ${signal.pair}`);
                  }}
                  fullWidth
                  size="md"
                  customText={signal.action === 'BUY' ? 'START LEARNING' : 'VIEW ANALYSIS'}
                  className="shadow-xl hover:shadow-2xl transition-shadow !py-3 sm:!py-3.5 md:!py-4"
                />
              </div>
            </div>
          </div>
        </div>


        {/* Random Educational Popup */}
        <RandomPopup />
      </EmailGateWrapper>
    );
  }

  const getDrillIcon = (type: string) => {
    switch (type) {
      case 'CASE_STUDY':
        return '📚';
      case 'ANALYTICS':
        return '📊';
      case 'BLOG':
        return '📝';
      default:
        return '📈';
    }
  };

  const renderDrillContent = (drill: Drill) => {
    switch (drill.type) {
      case 'CASE_STUDY':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-background-6 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">{drill.title}</h2>
              <p className="text-secondary/80 dark:text-accent/80 mb-6">{drill.description}</p>
              <div className="prose dark:prose-invert max-w-none">
                {drill.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Include technical analysis from signal */}
            {signal.keyLevels && (signal.keyLevels.support.length > 0 || signal.keyLevels.resistance.length > 0) && (
              <div className="bg-white dark:bg-background-6 rounded-xl p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Technical Levels Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Support Levels</h4>
                    {signal.keyLevels.support.map((level, index) => (
                      <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded mb-2">
                        {level.toFixed(4)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Resistance Levels</h4>
                    {signal.keyLevels.resistance.map((level, index) => (
                      <div key={index} className="p-2 bg-green-50 dark:bg-green-900/20 rounded mb-2">
                        {level.toFixed(4)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'ANALYTICS':
        return (
          <div>
            <div className="bg-white dark:bg-background-6 rounded-xl p-8 shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">{drill.title}</h2>
              <p className="text-secondary/80 dark:text-accent/80 mb-6">{drill.description}</p>
            </div>
            {/* Use the existing analytics component for ANALYTICS type drills */}
            <SignalDetailAnalytics signal={signal} />
          </div>
        );
      default:
        return (
          <div className="bg-white dark:bg-background-6 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{drill.title}</h2>
            <p className="text-secondary/80 dark:text-accent/80 mb-6">{drill.description}</p>
            <div className="prose dark:prose-invert max-w-none">
              {drill.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <EmailGateWrapper
      source={`signal_${signalId}`}
      title="Access Premium Signal Analysis"
      subtitle="Get instant access to detailed trading signals and live market analysis">
      <div className="min-h-screen bg-background-1 dark:bg-background-8">
        {/* Signal Header */}
        <div className="bg-white dark:bg-background-6 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Home Button */}
            <div className="pt-4">
              <Link
                href="/"
                onClick={() => {
                  // Start the trading flow when clicking home
                  if (!buttonPressed) {
                    handleStartTrading();
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-sm font-medium">Home</span>
              </Link>
            </div>
            <div className="py-6">
              <h1 className="text-3xl font-bold">{signal.title}</h1>
              <p className="text-secondary/70 dark:text-accent/70 mt-2">{signal.content}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  signal.action === 'BUY'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {signal.action} {signal.pair}
                </span>
                <span className="text-sm text-secondary/60">
                  Entry: {signal.entry.toFixed(4)} | Confidence: {signal.confidence}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drill Tabs */}
        <div className="bg-white dark:bg-background-6 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {drills.map((drill) => (
                <button
                  key={drill.id}
                  onClick={() => setActiveTab(drill.type)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === drill.type
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-secondary/70 hover:text-secondary hover:border-gray-300'
                  }`}
                >
                  {getDrillIcon(drill.type)} {drill.type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drill Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          {drills
            .filter(drill => drill.type === activeTab)
            .map(drill => (
              <div key={drill.id}>
                {renderDrillContent(drill)}
              </div>
            ))}
        </div>

        {/* Sticky Action Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/95 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900/95 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-5 z-40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
              <div className="hidden sm:block flex-1">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Educational content • Risk disclosure applies
                </p>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]">
                <ActionButton
                  variant={['urgent-countdown', 'live-pulse', 'profit-alert', 'rocket-launch'][signal.id % 4] as any}
                  onClick={() => {
                    // Start the trading flow if not already started
                    if (!buttonPressed) {
                      handleStartTrading();
                    }
                    // Navigate to external trading platform
                    window.open('https://platform.example.com/trade', '_blank');
                    console.log(`Opening trade for ${signal.pair}`);
                  }}
                  fullWidth
                  size="md"
                  customText={signal.action === 'BUY' ? 'START LEARNING' : 'VIEW ANALYSIS'}
                  className="shadow-xl hover:shadow-2xl transition-shadow !py-3 sm:!py-3.5 md:!py-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Random Educational Popup */}
      <RandomPopup />
    </EmailGateWrapper>
  );
}
