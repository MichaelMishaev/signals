'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SignalDetailAnalytics from '@/components/shared/signalDrill/SignalDetailAnalytics';
import { ActionButton } from '@/components/shared/sharedbuttons';
import { GateManager } from '@/components/shared/gates';
import { useGateFlow } from '@/hooks/useGateFlow';
import ExnessBanner from '@/components/shared/ExnessBanner';
import ExnessFooterBanner from '@/components/shared/ExnessFooterBanner';

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
  const t = useTranslations('signals.sidebar');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState<string>(drills.length > 0 ? drills[0].type : 'overview');
  const [buttonPressed, setButtonPressed] = useState<boolean>(false);

  // NEW Gate Flow Hook - single source of truth for gate state
  const gateFlow = useGateFlow({ confidence: signal.confidence, currentProfit: signal.pips });
  const { onDrillView, hasEmail } = gateFlow;

  // Handler to start the trading flow
  const handleStartTrading = () => {
    const now = Date.now();
    localStorage.setItem('tradingStartTime', now.toString());
    setButtonPressed(true);
  };

  // Track drill view when first drill tab is shown
  useEffect(() => {
    if (drills.length > 0 && activeTab === drills[0].type) {
      console.log('[SignalPageClient] Recording initial drill view:', drills[0].id);
      onDrillView(drills[0].id);
    }
  }, []); // Only run once on mount

  // If no drills available, show the legacy analytics view
  if (!drills || drills.length === 0) {
    return (
      <>
        <div id="main-content" className="min-h-screen bg-background-1 dark:bg-background-8 pb-24">
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

        {/* Gate Manager for Email/Broker Gates */}
        <GateManager gateFlow={gateFlow} />
      </>
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
    <>
      <div id="main-content" className="min-h-screen bg-background-1 dark:bg-background-8">
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
                className="inline-flex items-center gap-2 px-6 py-3 md:px-4 md:py-2 min-h-[44px] min-w-[44px] touch-manipulation bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {t('labels.entry')}: {signal.entry.toFixed(4)} | {t('labels.confidence')}: {signal.confidence}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drill Tabs */}
        <div className="bg-white dark:bg-background-6 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto">
              {drills.map((drill) => (
                <button
                  key={drill.id}
                  onClick={() => {
                    setActiveTab(drill.type);
                    // Track drill tab view
                    onDrillView(drill.id);
                  }}
                  className={`py-4 px-4 border-b-3 font-semibold text-sm sm:text-base whitespace-nowrap transition-all duration-200 ${
                    activeTab === drill.type
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-transparent text-secondary/60 dark:text-accent/60 hover:text-secondary dark:hover:text-accent hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-background-5'
                  }`}
                >
                  <span className="text-lg mr-2">{getDrillIcon(drill.type)}</span>
                  <span>{drill.type.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drill Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content - ONLY SHOW IF EMAIL VERIFIED */}
            <div className="lg:col-span-9">
              {hasEmail ? (
                drills
                  .filter(drill => drill.type === activeTab)
                  .map(drill => (
                    <div key={drill.id}>
                      {renderDrillContent(drill)}
                    </div>
                  ))
              ) : (
                <div className="bg-white dark:bg-background-6 rounded-xl p-12 shadow-lg text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🔒</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Verify Your Email to Access Drill Content
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Please verify your email address to unlock detailed analysis, case studies, and premium trading insights.
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Check your email for the magic link</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Banner */}
            <aside className="lg:col-span-3">
              <ExnessBanner />
            </aside>
          </div>
        </div>

        {/* Footer Banner - Above sticky button */}
        <div className="pb-24 lg:pb-28">
          <ExnessFooterBanner />
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

      {/* Gate Manager for Email/Broker Gates */}
      <GateManager gateFlow={gateFlow} />
    </>
  );
}
