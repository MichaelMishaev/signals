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
import { trackAffiliateClick } from '@/utils/affiliateTracking';

// Market data interface
interface MarketData {
  pair: string;
  price: number;
  change24h: number;
  volume?: string;
}

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
  const [shouldShowContent, setShouldShowContent] = useState<boolean>(true); // First drill is always free
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [marketDataLoading, setMarketDataLoading] = useState<boolean>(true);

  // NEW Gate Flow Hook - single source of truth for gate state
  const gateFlow = useGateFlow({ confidence: signal.confidence, currentProfit: signal.pips });
  const { onDrillView, hasEmail, drillsViewed, activeGate } = gateFlow;

  // Fetch real-time market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setMarketDataLoading(true);

        // Fetch crypto prices from CoinGecko (no API key needed)
        const cryptoResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
        );
        const cryptoData = await cryptoResponse.json();

        // Fetch forex rates from ExchangeRate-API (no API key needed)
        const forexResponse = await fetch('https://open.er-api.com/v6/latest/USD');
        const forexData = await forexResponse.json();

        // Format the data
        const marketDataArray: MarketData[] = [
          {
            pair: 'BTC/USD',
            price: cryptoData.bitcoin?.usd || 0,
            change24h: cryptoData.bitcoin?.usd_24h_change || 0,
            volume: cryptoData.bitcoin?.usd_24h_vol ? `$${(cryptoData.bitcoin.usd_24h_vol / 1000000000).toFixed(2)}B` : undefined,
          },
          {
            pair: 'ETH/USD',
            price: cryptoData.ethereum?.usd || 0,
            change24h: cryptoData.ethereum?.usd_24h_change || 0,
            volume: cryptoData.ethereum?.usd_24h_vol ? `$${(cryptoData.ethereum.usd_24h_vol / 1000000000).toFixed(2)}B` : undefined,
          },
          {
            pair: 'EUR/USD',
            price: forexData.rates?.EUR ? 1 / forexData.rates.EUR : 0,
            change24h: 0, // Forex API doesn't provide 24h change
          },
          {
            pair: 'GBP/USD',
            price: forexData.rates?.GBP ? 1 / forexData.rates.GBP : 0,
            change24h: 0,
          },
        ];

        setMarketData(marketDataArray);
      } catch (error) {
        console.error('Error fetching market data:', error);
        // Fallback data if API fails
        setMarketData([
          { pair: 'BTC/USD', price: 0, change24h: 0 },
          { pair: 'EUR/USD', price: 0, change24h: 0 },
        ]);
      } finally {
        setMarketDataLoading(false);
      }
    };

    fetchMarketData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handler to start the trading flow
  const handleStartTrading = () => {
    const now = Date.now();
    localStorage.setItem('tradingStartTime', now.toString());
    setButtonPressed(true);
  };

  // REMOVED: Don't auto-record first drill on page load
  // Users should get the first drill for free, gate appears on 2nd drill
  // The onDrillView is only called when user clicks drill tabs (line 265)

  // Update content visibility based on gate state
  // First drill is always free, subsequent drills require email
  useEffect(() => {
    console.log('[SignalPageClient] Updating shouldShowContent:', {
      hasEmail,
      drillsViewed,
      currentValue: shouldShowContent,
    });

    // If user has email, always show content
    if (hasEmail) {
      console.log('[SignalPageClient] User has email - showing content');
      setShouldShowContent(true);
      return;
    }

    // If no email: first drill is free (drillsViewed === 0), hide after first drill click
    // drillsViewed === 0: First drill is free, show content
    // drillsViewed >= 1: Already viewed a drill, need email for more
    const newValue = drillsViewed === 0;
    console.log('[SignalPageClient] No email - setting shouldShowContent to:', newValue);
    setShouldShowContent(newValue);
  }, [hasEmail, drillsViewed]);

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
                {marketDataLoading ? (
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                    Loading market data...
                  </p>
                ) : (
                  <div className="flex items-center gap-4 overflow-x-auto">
                    {marketData.slice(0, 3).map((data, index) => (
                      <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {data.pair}
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          ${data.price.toFixed(data.pair.includes('BTC') ? 0 : data.pair.includes('ETH') ? 0 : 4)}
                        </span>
                        {data.change24h !== 0 && (
                          <span className={`text-xs font-medium ${data.change24h > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {data.change24h > 0 ? '↑' : '↓'} {Math.abs(data.change24h).toFixed(2)}%
                          </span>
                        )}
                      </div>
                    ))}
                    <span className="text-xs text-gray-400 dark:text-gray-500">• Live Data</span>
                  </div>
                )}
              </div>
              <div className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]">
                <ActionButton
                  variant={['urgent-countdown', 'live-pulse', 'profit-alert', 'rocket-launch'][signal.id % 4] as any}
                  onClick={async () => {
                    // Start the trading flow if not already started
                    if (!buttonPressed) {
                      handleStartTrading();
                    }
                    // Track affiliate click and get tracking URL
                    const buttonVariants = ['urgent-countdown', 'live-pulse', 'profit-alert', 'rocket-launch'];
                    const variant = buttonVariants[signal.id % 4];
                    const affiliateUrl = await trackAffiliateClick({
                      signalId: signal.id,
                      source: 'signal_page_cta',
                      buttonVariant: variant,
                      metadata: {
                        signalPair: signal.pair,
                        signalAction: signal.action,
                        signalConfidence: signal.confidence,
                      },
                    });
                    // Open affiliate link
                    window.open(affiliateUrl, '_blank');
                    console.log(`Opening Exness affiliate link for ${signal.pair}`);
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
                onClick={async (e) => {
                  // Start the trading flow when clicking home
                  if (!buttonPressed) {
                    handleStartTrading();
                  }
                  // Track navigation from signal page
                  await trackAffiliateClick({
                    signalId: signal.id,
                    source: 'signal_page_home_button',
                    metadata: {
                      action: 'navigation_home',
                      fromSignal: signal.pair,
                    },
                  });
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
            {/* Main Content - Show first drill for free, require email for subsequent drills */}
            <div className="lg:col-span-9">
              {shouldShowContent ? (
                drills
                  .filter(drill => drill.type === activeTab)
                  .map(drill => (
                    <div key={drill.id}>
                      {renderDrillContent(drill)}
                    </div>
                  ))
              ) : activeGate ? (
                /* When email gate is active, show a simple message - the modal will overlay */
                <div className="bg-white dark:bg-background-6 rounded-xl p-12 shadow-lg text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="text-4xl">✉️</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Almost There!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Please provide your email address to continue accessing premium trading content.
                  </p>
                </div>
              ) : (
                /* Fallback: Show verification reminder */
                <div className="bg-white dark:bg-background-6 rounded-xl p-12 shadow-lg text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🔒</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Verify Your Email to Access More Drills
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You've viewed your free drill. Verify your email to unlock all detailed analysis, case studies, and premium trading insights.
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
                {marketDataLoading ? (
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                    Loading market data...
                  </p>
                ) : (
                  <div className="flex items-center gap-4 overflow-x-auto">
                    {marketData.slice(0, 3).map((data, index) => (
                      <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {data.pair}
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          ${data.price.toFixed(data.pair.includes('BTC') ? 0 : data.pair.includes('ETH') ? 0 : 4)}
                        </span>
                        {data.change24h !== 0 && (
                          <span className={`text-xs font-medium ${data.change24h > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {data.change24h > 0 ? '↑' : '↓'} {Math.abs(data.change24h).toFixed(2)}%
                          </span>
                        )}
                      </div>
                    ))}
                    <span className="text-xs text-gray-400 dark:text-gray-500">• Live Data</span>
                  </div>
                )}
              </div>
              <div className="w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]">
                <ActionButton
                  variant={['urgent-countdown', 'live-pulse', 'profit-alert', 'rocket-launch'][signal.id % 4] as any}
                  onClick={async () => {
                    // Start the trading flow if not already started
                    if (!buttonPressed) {
                      handleStartTrading();
                    }
                    // Track affiliate click and get tracking URL
                    const buttonVariants = ['urgent-countdown', 'live-pulse', 'profit-alert', 'rocket-launch'];
                    const variant = buttonVariants[signal.id % 4];
                    const affiliateUrl = await trackAffiliateClick({
                      signalId: signal.id,
                      source: 'signal_page_cta',
                      buttonVariant: variant,
                      metadata: {
                        signalPair: signal.pair,
                        signalAction: signal.action,
                        signalConfidence: signal.confidence,
                      },
                    });
                    // Open affiliate link
                    window.open(affiliateUrl, '_blank');
                    console.log(`Opening Exness affiliate link for ${signal.pair}`);
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
