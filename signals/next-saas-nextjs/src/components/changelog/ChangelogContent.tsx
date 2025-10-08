'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import RevealAnimation from '../animation/RevealAnimation';
import { SignalData } from '@/utils/supabase';
import { ActionButton } from '@/components/shared/sharedbuttons';
import AdBanner from '@/components/shared/banners/AdBanner';

interface SignalUpdate {
  id: number;
  type: 'SIGNAL' | 'MARKET_NEWS' | 'ANALYSIS' | 'ALERT';
  timestamp: string;
  title: string;
  content: string;
  pair?: string;
  action?: 'BUY' | 'SELL';
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  confidence?: number;
  market: 'FOREX' | 'CRYPTO' | 'PSX' | 'COMMODITIES';
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  result?: 'WIN' | 'LOSS' | 'BREAK_EVEN';
  pips?: number;
  author: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  hasDrillData?: boolean;
}

// Fallback static data if API fails
const fallbackSignalsData: SignalUpdate[] = [
  {
    id: 4, // Match database ID
    type: 'SIGNAL',
    timestamp: 'Today',
    title: 'EUR/USD Strong BUY Signal Generated',
    content:
      'Technical analysis shows bullish momentum with RSI oversold recovery and key support at 1.0820. Expected target at 1.0920 with tight stop loss management.',
    pair: 'EUR/USD',
    action: 'BUY',
    entry: 1.085,
    stopLoss: 1.082,
    takeProfit: 1.092,
    confidence: 87,
    market: 'FOREX',
    status: 'ACTIVE',
    author: 'Ahmad Ali',
    priority: 'HIGH',
  },
  {
    id: 2,
    type: 'MARKET_NEWS',
    timestamp: '1 day ago',
    title: 'USD/PKR Hits New Monthly High',
    content:
      'Pakistani Rupee weakens against USD amid rising inflation concerns. Central bank intervention expected. Key resistance at 286.50 PKR.',
    pair: 'USD/PKR',
    market: 'FOREX',
    status: 'ACTIVE',
    author: 'Fatima Khan',
    priority: 'HIGH',
  },
  {
    id: 6, // Match BTC/USDT database ID
    type: 'SIGNAL',
    timestamp: '2 days ago',
    title: 'BTC/USDT Breakout Signal - Crypto Rally Continues',
    content:
      'Bitcoin showing strong bullish momentum with break above key resistance. Volume surge confirms institutional buying interest.',
    pair: 'BTC/USDT',
    action: 'BUY',
    entry: 45000,
    stopLoss: 44500,
    takeProfit: 46500,
    confidence: 91,
    market: 'CRYPTO',
    status: 'ACTIVE',
    pips: 300,
    author: 'Ahmad Ali',
    priority: 'HIGH',
  },
  {
    id: 7, // Match Gold database ID
    type: 'SIGNAL',
    timestamp: '3 days ago',
    title: 'Gold (XAU/USD) Safe Haven BUY Signal',
    content:
      'Gold breaking above $2000 resistance with geopolitical tensions rising. Safe haven demand increasing. Technical indicators strongly bullish.',
    pair: 'XAU/USD',
    action: 'BUY',
    entry: 2005.5,
    stopLoss: 1995.0,
    takeProfit: 2025.0,
    confidence: 85,
    market: 'COMMODITIES',
    status: 'ACTIVE',
    author: 'Sarah Mitchell',
    priority: 'MEDIUM',
  },
  {
    id: 20, // Non-signal, unique ID
    type: 'SIGNAL',
    timestamp: '4 days ago',
    title: 'OGDC Strong Buy Recommendation',
    content:
      'Oil & Gas Development Company showing bullish patterns. Breakout above 92.50 PKR confirmed. Target 97.50 PKR.',
    pair: 'OGDC',
    action: 'BUY',
    entry: 92.5,
    stopLoss: 90.0,
    takeProfit: 97.5,
    confidence: 82,
    market: 'PSX',
    status: 'CLOSED',
    result: 'WIN',
    pips: 250,
    author: 'Omar Sheikh',
    priority: 'MEDIUM',
  },
  {
    id: 6,
    type: 'ALERT',
    timestamp: '5 days ago',
    title: 'Market Volatility Alert: High Impact News',
    content:
      'US Federal Reserve statement creates market uncertainty. Expect high volatility in USD pairs. Risk management strategies recommended.',
    market: 'FOREX',
    status: 'ACTIVE',
    author: 'Trading Desk',
    priority: 'HIGH',
  },
  {
    id: 7,
    type: 'MARKET_NEWS',
    timestamp: '1 week ago',
    title: 'PSX 100 Index Reaches New Highs',
    content:
      'Pakistan Stock Exchange continues rally amid positive economic indicators. Banking sector leading gains with 2.8% increase.',
    market: 'PSX',
    status: 'ACTIVE',
    author: 'Market Reporter',
    priority: 'LOW',
  },
  {
    id: 8,
    type: 'SIGNAL',
    timestamp: '1 week ago',
    title: 'GBP/PKR Sell Signal Triggered',
    content:
      'British Pound shows weakness against PKR. Technical indicators suggest further decline. Entry at 358.20 PKR.',
    pair: 'GBP/PKR',
    action: 'SELL',
    entry: 358.2,
    stopLoss: 360.5,
    takeProfit: 354.8,
    confidence: 74,
    market: 'FOREX',
    status: 'ACTIVE',
    author: 'Zara Bhatti',
    priority: 'MEDIUM',
  },
];

const ChangelogContent = () => {
  const t = useTranslations('signals');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [signalsData, setSignalsData] = useState<SignalUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch signals from API
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch(`/api/signals?limit=10&status=ACTIVE&locale=${locale}`);
        const data = await response.json();

        // Convert API signals to SignalUpdate format
        const formattedSignals: SignalUpdate[] = data.signals.map((signal: SignalData, index: number) => {
          // Calculate time ago from created_at or published_date
          const signalDate = new Date(signal.created_at || signal.published_date);
          const now = new Date();
          const diffMs = now.getTime() - signalDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          let timestamp: string;
          if (diffMins < 1) {
            timestamp = 'Just now';
          } else if (diffMins < 60) {
            timestamp = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
          } else if (diffHours < 24) {
            timestamp = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
          } else if (diffDays === 1) {
            timestamp = '1 day ago';
          } else if (diffDays < 7) {
            timestamp = `${diffDays} days ago`;
          } else {
            const weeks = Math.floor(diffDays / 7);
            timestamp = `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
          }

          return {
            id: signal.id,
            type: 'SIGNAL' as const,
            timestamp,
            title: signal.title,
            content: signal.content,
            pair: signal.pair,
            action: signal.action as 'BUY' | 'SELL',
            entry: signal.entry,
            stopLoss: signal.stop_loss,
            takeProfit: signal.take_profit,
            confidence: signal.confidence,
            market: signal.market as 'FOREX' | 'CRYPTO' | 'PSX' | 'COMMODITIES',
            status: signal.status as 'ACTIVE' | 'CLOSED' | 'CANCELLED',
            pips: signal.pips,
            author: signal.author,
            priority: signal.priority as 'HIGH' | 'MEDIUM' | 'LOW',
            // Check if drill data is available
            hasDrillData: !!(signal.key_levels && signal.analyst_stats && signal.current_price),
          };
        });

        setSignalsData(formattedSignals);
      } catch (error) {
        console.error('Error fetching signals:', error);
        // Use fallback data if API fails
        setSignalsData(fallbackSignalsData);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSignals, 30000);
    return () => clearInterval(interval);
  }, [locale]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SIGNAL':
        return '📈';
      case 'MARKET_NEWS':
        return '📰';
      case 'ANALYSIS':
        return '🔍';
      case 'ALERT':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const getTypeBadge = (type: string, priority: string) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';

    switch (type) {
      case 'SIGNAL':
        return `${baseClasses} ${priority === 'HIGH' ? 'bg-ns-green text-white' : 'bg-ns-green-light text-primary-800 dark:bg-ns-green/20 dark:text-ns-green'}`;
      case 'MARKET_NEWS':
        return `${baseClasses} bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300`;
      case 'ANALYSIS':
        return `${baseClasses} bg-ns-cyan-light text-primary-800 dark:bg-ns-cyan/20 dark:text-ns-cyan`;
      case 'ALERT':
        return `${baseClasses} ${priority === 'HIGH' ? 'bg-ns-red text-white' : 'bg-ns-yellow text-background-8'}`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`;
    }
  };

  const getStatusBadge = (status: string, result?: string) => {
    if (status === 'CLOSED' && result) {
      switch (result) {
        case 'WIN':
          return 'bg-ns-green-light text-primary-800 dark:bg-ns-green/20 dark:text-ns-green';
        case 'LOSS':
          return 'bg-ns-red/20 text-red-800 dark:bg-red-900 dark:text-ns-red';
        default:
          return 'bg-background-11/20 text-secondary dark:bg-background-11/10 dark:text-accent/70';
      }
    }
    switch (status) {
      case 'ACTIVE':
        return 'bg-ns-yellow-light text-primary-800 dark:bg-ns-yellow/20 dark:text-ns-yellow';
      case 'CANCELLED':
        return 'bg-background-11/20 text-secondary dark:bg-background-11/10 dark:text-accent/70';
      default:
        return 'bg-background-11/20 text-secondary';
    }
  };

  const getPriorityDotColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-ns-red';
      case 'MEDIUM':
        return 'bg-ns-yellow';
      case 'LOW':
        return 'bg-ns-green';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="pb-[100px] pt-[100px] px-6">
      <div className="space-y-[70px]">
        <div className="space-y-3 text-center">
          <RevealAnimation delay={0.3}>
            <h2>{t('section.title')}</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p>{t('section.subtitle')}</p>
          </RevealAnimation>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-stroke-2 dark:bg-stroke-6 h-full hidden lg:block"></div>

          <div className="space-y-8">
            <RevealAnimation delay={0.5}>
              <div className="text-center mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-ns-green-light text-primary-800 dark:bg-ns-green/20 dark:text-ns-green">
                  {t('section.liveBadge')}
                </span>
              </div>
            </RevealAnimation>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-sm text-secondary/60 mt-2">{t('sidebar.loading')}</p>
              </div>
            ) : signalsData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-secondary/60">{t('sidebar.noSignals')}</p>
              </div>
            ) : (
              signalsData.map((signal, index) => (
              <React.Fragment key={`${signal.id}-${index}`}>
              <RevealAnimation delay={0.6 + index * 0.1}>
                <div className="relative max-w-[850px] mx-auto">
                  {/* Timeline dot with priority indicator */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 ${getPriorityDotColor(signal.priority)} rounded-full border-4 border-background-3 dark:border-background-7 z-20 -mt-2 hidden lg:block shadow-lg`}>
                    <div className="w-2 h-2 bg-white dark:bg-background-8 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>

                  {/* Time stamp */}
                  <div className="flex justify-center mb-3">
                    <time className="text-sm font-medium text-secondary/60 dark:text-accent/60 bg-background-1 dark:bg-background-8 px-3 py-1 rounded-lg border border-stroke-2 dark:border-stroke-6">
                      {signal.timestamp}
                    </time>
                  </div>

                  {/* Type and status badges */}
                  <div className="flex justify-center gap-2 mb-4">
                    <span className={getTypeBadge(signal.type, signal.priority)}>
                      {getTypeIcon(signal.type)} {signal.type.replace('_', ' ')}
                    </span>
                    {signal.status && signal.pair && (
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadge(signal.status, signal.result)}`}>
                        {signal.status === 'CLOSED' && signal.result ? tCommon(`status.${signal.result.toLowerCase()}`) : tCommon(`status.${signal.status.toLowerCase()}`)}
                      </span>
                    )}
                    {/* Drill availability indicator */}
                    {signal.type === 'SIGNAL' && (
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        signal.hasDrillData
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {signal.hasDrillData ? t('drillAvailability.available') : t('drillAvailability.basic')}
                      </span>
                    )}
                  </div>

                  {/* Wrap signal content with Link only if drill data is available */}
                  {signal.type === 'SIGNAL' && signal.hasDrillData ? (
                    <Link href={`/signal/${signal.id}`} className="block">
                      <div className="bg-gradient-to-br from-background-2 to-background-3 dark:from-background-6 dark:to-background-7 px-[42px] py-10 space-y-6 rounded-[20px] relative overflow-hidden z-10 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                        {/* STEP 7: Simplified CSS gradient - no complex images */}

                        {/* Signal Header */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                              {signal.title}
                            </h3>
                            <span className="text-sm text-secondary/60 dark:text-accent/60">by {signal.author}</span>
                          </div>

                          <p className="text-secondary dark:text-accent leading-relaxed">{signal.content}</p>
                        </div>

                        {/* Signal Details (for SIGNAL type) */}
                        {signal.type === 'SIGNAL' && signal.pair && (
                          <div className="bg-background-3 dark:bg-background-5 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-gray-900 dark:text-white">{signal.pair}</h4>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-lg font-bold ${signal.action === 'BUY' ? 'text-primary-600 dark:text-ns-green' : 'text-red-600 dark:text-ns-red'}`}>
                                  {tCommon(`actions.${signal.action.toLowerCase()}`)}
                                </span>
                                {signal.confidence && (
                                  <span className="text-sm font-bold bg-background-1 dark:bg-background-8 px-2 py-1 rounded">
                                    {signal.confidence}%
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              {signal.entry && (
                                <div>
                                  <span className="block text-secondary/60 dark:text-accent/60">{t('sidebar.labels.entry')}</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {signal.entry.toFixed(signal.pair.includes('PKR') ? 2 : 4)}
                                  </span>
                                </div>
                              )}
                              {signal.stopLoss && (
                                <div>
                                  <span className="block text-secondary/60 dark:text-accent/60">{t('sidebar.labels.stopLoss')}</span>
                                  <span className="font-semibold text-red-600 dark:text-ns-red">
                                    {signal.stopLoss.toFixed(signal.pair.includes('PKR') ? 2 : 4)}
                                  </span>
                                </div>
                              )}
                              {signal.takeProfit && (
                                <div>
                                  <span className="block text-secondary/60 dark:text-accent/60">{t('sidebar.labels.takeProfit')}</span>
                                  <span className="font-semibold text-primary-600 dark:text-ns-green">
                                    {signal.takeProfit.toFixed(signal.pair.includes('PKR') ? 2 : 4)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {signal.result && signal.pips && (
                              <div className="pt-3 border-t border-stroke-2 dark:border-stroke-6">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-secondary/60 dark:text-accent/60">{t('sidebar.labels.result')}</span>
                                  <span
                                    className={`font-bold ${signal.result === 'WIN' ? 'text-primary-600 dark:text-ns-green' : 'text-red-600 dark:text-ns-red'}`}>
                                    {tCommon(`status.${signal.result.toLowerCase()}`)} ({signal.pips > 0 ? '+' : ''}
                                    {signal.pips} pips)
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Action Button for Signal */}
                            <div className="pt-3">
                              <ActionButton
                                variant={['urgent-countdown', 'live-pulse', 'profit-alert', 'rocket-launch'][index % 4] as any}
                                onClick={() => console.log(`Execute ${signal.action} for ${signal.pair}`)}
                                fullWidth
                                size="md"
                                customText={signal.action === 'BUY' ? tCommon('actions.buyOrder') : tCommon('actions.sellOrder')}
                              />
                            </div>
                          </div>
                        )}

                        {/* Market info */}
                        <div className="flex items-center justify-between text-sm text-secondary/60 dark:text-accent/60 pt-3 border-t border-stroke-2 dark:border-stroke-6">
                          <span>{t('sidebar.labels.market')}: {tCommon(`markets.${signal.market.toLowerCase()}`)}</span>
                          <span className="flex items-center gap-1">
                            {t('sidebar.labels.priority')}:
                            <span className={`w-2 h-2 rounded-full ${getPriorityDotColor(signal.priority)}`}></span>
                            {tCommon(`priority.${signal.priority.toLowerCase()}`)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : signal.type === 'SIGNAL' && !signal.hasDrillData ? (
                    /* Non-clickable signal without drill data */
                    <div className="bg-gradient-to-br from-background-2 to-background-3 dark:from-background-6 dark:to-background-7 px-[42px] py-10 space-y-6 rounded-[20px] relative overflow-hidden z-10 opacity-90">
                      {/* STEP 7: Simplified CSS gradient - no complex images */}

                      {/* Signal content */}
                      <div className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-semibold leading-tight">{signal.title}</h3>
                        <p className="text-secondary/80 dark:text-accent/80 leading-relaxed">{signal.content}</p>

                        {/* Signal details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="text-center p-3 bg-background-1 dark:bg-background-5 rounded-lg">
                            <p className="text-xs text-secondary/60">Entry</p>
                            <p className="font-bold">{signal.entry?.toFixed(4)}</p>
                          </div>
                          <div className="text-center p-3 bg-background-1 dark:bg-background-5 rounded-lg">
                            <p className="text-xs text-secondary/60">Stop Loss</p>
                            <p className="font-bold text-red-600">{signal.stopLoss?.toFixed(4)}</p>
                          </div>
                          <div className="text-center p-3 bg-background-1 dark:bg-background-5 rounded-lg">
                            <p className="text-xs text-secondary/60">Take Profit</p>
                            <p className="font-bold text-ns-green">{signal.takeProfit?.toFixed(4)}</p>
                          </div>
                          <div className="text-center p-3 bg-background-1 dark:bg-background-5 rounded-lg">
                            <p className="text-xs text-secondary/60">Confidence</p>
                            <p className="font-bold">{signal.confidence}%</p>
                          </div>
                        </div>

                        {/* Action Button for Non-Drill Signal */}
                        {signal.action && (
                          <div className="pt-3">
                            <ActionButton
                              variant={['urgent-countdown', 'live-pulse', 'profit-alert', 'rocket-launch'][index % 4] as any}
                              onClick={() => console.log(`Execute ${signal.action} for ${signal.pair}`)}
                              fullWidth
                              size="md"
                              customText={signal.action === 'BUY' ? 'BUY ORDER' : 'SELL ORDER'}
                            />
                          </div>
                        )}

                        {/* Author and metadata */}
                        <div className="flex justify-between items-center pt-4 border-t border-stroke-2 dark:border-stroke-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{signal.author.charAt(0)}</span>
                            </div>
                            <span className="text-sm font-medium">{signal.author}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityDotColor(signal.priority)} text-white`}>
                            {tCommon(`priority.${signal.priority.toLowerCase()}`)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-background-2 to-background-3 dark:from-background-6 dark:to-background-7 px-[42px] py-10 space-y-6 rounded-[20px] relative overflow-hidden z-10">
                      {/* STEP 7: Simplified CSS gradient - no complex images */}

                      {/* Non-signal content */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{signal.title}</h3>
                          <span className="text-sm text-secondary/60 dark:text-accent/60">by {signal.author}</span>
                        </div>
                        <p className="text-secondary dark:text-accent leading-relaxed">{signal.content}</p>
                      </div>

                      {/* Market info */}
                      <div className="flex items-center justify-between text-sm text-secondary/60 dark:text-accent/60 pt-3 border-t border-stroke-2 dark:border-stroke-6">
                        <span>{t('sidebar.labels.market')}: {tCommon(`markets.${signal.market.toLowerCase()}`)}</span>
                        <span className="flex items-center gap-1">
                          {t('sidebar.labels.priority')}:
                          <span className={`w-2 h-2 rounded-full ${getPriorityDotColor(signal.priority)}`}></span>
                          {tCommon(`priority.${signal.priority.toLowerCase()}`)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </RevealAnimation>

              {/* Insert banner after every 3rd signal */}
              {(index + 1) % 3 === 0 && index < signalsData.length - 1 && (
                <RevealAnimation delay={0.6 + index * 0.1 + 0.05}>
                  <AdBanner position="between-signals" />
                </RevealAnimation>
              )}
              </React.Fragment>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogContent;
