'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RevealAnimation from '@/components/animation/RevealAnimation';

interface SignalData {
  id: number;
  type: string;
  title: string;
  content: string;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  currentPrice?: number; // Optional - may not exist for all signals
  confidence: number;
  market: string;
  status: string;
  pips: number;
  author: string;
  authorImage?: string; // Optional - may be missing
  publishDate: string;
  keyLevels?: { // Optional - may not exist
    resistance: number[];
    support: number[];
  };
  // Chart image for visual display
  chartImage?: string;
  // Analyst additional info
  analystStats?: {
    successRate: number;
    totalSignals: number;
    totalPips?: number; // Optional - may be null for some analysts
  };
}

interface SignalDetailAnalyticsProps {
  signal: SignalData;
}

const SignalDetailAnalytics = ({ signal }: SignalDetailAnalyticsProps) => {
  // Track if chart image loaded successfully
  const [chartImageLoaded, setChartImageLoaded] = useState(false);
  const [chartImageError, setChartImageError] = useState(false);

  // Safe calculations with null checks
  const profitLoss = signal.currentPrice ? (signal.currentPrice - signal.entry) * (signal.action === 'BUY' ? 1 : -1) : 0;

  // Prevent division by zero
  const riskRewardRatio = signal.stopLoss !== signal.entry
    ? Math.abs((signal.takeProfit - signal.entry) / (signal.entry - signal.stopLoss))
    : 0;

  // Check if we have key levels data
  const hasKeyLevels = signal.keyLevels && (
    (signal.keyLevels.support && signal.keyLevels.support.length > 0) ||
    (signal.keyLevels.resistance && signal.keyLevels.resistance.length > 0)
  );

  // Only show chart if we have image path AND it loads successfully (or hasn't errored yet)
  const shouldShowChart = signal.chartImage && !chartImageError;

  // Default avatar fallback
  const avatarImage = signal.authorImage || '/images/avatar/avatar-1.png';

  return (
    <section className="pt-[70px] pb-[100px] analytics">
      <div className="max-w-[1200px] w-[95%] mx-auto">
        {/* Back to Main Menu Button */}
        <RevealAnimation delay={0.05}>
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-background-6 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-background-5 transition-colors duration-200 text-secondary dark:text-accent"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Main Menu
            </Link>
          </div>
        </RevealAnimation>

        {/* Signal Header */}
        <RevealAnimation delay={0.1}>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  signal.type === 'SIGNAL' ? 'bg-ns-green text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                📈 {signal.type} ANALYTICS
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  signal.status === 'ACTIVE' ? 'bg-ns-yellow-light text-primary-800' : 'bg-gray-200 text-gray-800'
                }`}>
                {signal.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{signal.title}</h1>
            <p className="text-secondary/70 dark:text-accent/70 max-w-[600px] mx-auto">{signal.content}</p>
          </div>
        </RevealAnimation>

        {/* KPI Dashboard */}
        <RevealAnimation delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-background-6 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-ns-green">
                {signal.pips > 0 ? '+' : ''}
                {signal.pips}
              </h3>
              <p className="text-sm text-secondary/60">Current Pips</p>
            </div>
            <div className="bg-white dark:bg-background-6 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-primary-600">{signal.confidence}%</h3>
              <p className="text-sm text-secondary/60">Confidence</p>
            </div>
            <div className="bg-white dark:bg-background-6 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-ns-yellow">1:{riskRewardRatio.toFixed(1)}</h3>
              <p className="text-sm text-secondary/60">Risk/Reward</p>
            </div>
            <div className="bg-white dark:bg-background-6 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-secondary">{signal.market}</h3>
              <p className="text-sm text-secondary/60">Market</p>
            </div>
          </div>
        </RevealAnimation>

        {/* Main Analytics Dashboard */}
        <div className="space-y-12">
          {/* Price Analytics */}
          {(shouldShowChart || hasKeyLevels) && (
            <RevealAnimation delay={0.3}>
              <div className="bg-white dark:bg-background-6 rounded-xl p-8">
                {/* Only show heading if we have chart or key levels */}
                {(shouldShowChart || hasKeyLevels) && (
                  <h2 className="text-2xl font-bold mb-6">Price Movement Analytics</h2>
                )}

                {/* Chart Area - Only show if chartImage exists and loads successfully */}
                {shouldShowChart && (
                  <div className="bg-gray-900 rounded-lg p-6 mb-6 min-h-[400px] flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <Image
                        src={signal.chartImage!}
                        alt={`${signal.pair} Trading Chart`}
                        fill
                        className="object-contain rounded"
                        priority
                        onLoad={() => setChartImageLoaded(true)}
                        onError={() => {
                          console.warn(`Chart image failed to load: ${signal.chartImage}`);
                          setChartImageError(true);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Key Levels Table - Only show if hasKeyLevels */}
                {hasKeyLevels && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Support Levels */}
                    {signal.keyLevels?.support && signal.keyLevels.support.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Support Levels</h4>
                        <div className="space-y-2">
                          {signal.keyLevels.support.map((level, index) => (
                            <div key={index} className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                              <span>Support {index + 1}</span>
                              <span className="font-mono">{level.toFixed(4)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Resistance Levels */}
                    {signal.keyLevels?.resistance && signal.keyLevels.resistance.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Resistance Levels</h4>
                        <div className="space-y-2">
                          {signal.keyLevels.resistance.map((level, index) => (
                            <div key={index} className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                              <span>Resistance {index + 1}</span>
                              <span className="font-mono">{level.toFixed(4)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </RevealAnimation>
          )}

          {/* Performance Metrics - REMOVED: Contained fake hardcoded data (75% risk, 90% profit)
              Only real confidence score remains in KPI dashboard above */}

          {/* Signal Breakdown */}
          <RevealAnimation delay={0.5}>
            <div className="bg-white dark:bg-background-6 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Signal Breakdown Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Entry Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Action Type</span>
                      <span className={`font-semibold ${signal.action === 'BUY' ? 'text-ns-green' : 'text-red-600'}`}>
                        {signal.action}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Entry Price</span>
                      <span className="font-mono">{signal.entry.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Stop Loss</span>
                      <span className="font-mono text-red-600">{signal.stopLoss.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Take Profit</span>
                      <span className="font-mono text-ns-green">{signal.takeProfit.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Live Status</h4>
                  <div className="space-y-3">
                    {signal.currentPrice && (
                      <div className="flex justify-between">
                        <span className="text-secondary/60">Current Price</span>
                        <span className="font-mono font-bold">{signal.currentPrice.toFixed(4)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Unrealized P&L</span>
                      <span className={`font-semibold ${signal.pips > 0 ? 'text-ns-green' : 'text-red-600'}`}>
                        {signal.pips > 0 ? '+' : ''}
                        {signal.pips} pips
                      </span>
                    </div>
                    {/* Time Active - REMOVED: Was hardcoded fake data */}
                    {signal.currentPrice && signal.takeProfit !== signal.entry && (
                      <div className="flex justify-between">
                        <span className="text-secondary/60">Progress to Target</span>
                        <span>{((signal.pips / ((signal.takeProfit - signal.entry) * 10000)) * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>

          {/* Analyst Information */}
          <RevealAnimation delay={0.6}>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-xl p-8">
              <div className="flex items-center gap-4">
                <Image
                  src={avatarImage}
                  alt={signal.author}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold">{signal.author}</h3>
                  <p className="text-secondary/60">Senior Trading Analyst</p>
                  <p className="text-sm mt-2">Published: {signal.publishDate}</p>
                </div>
              </div>

              {signal.analystStats && (
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{signal.analystStats.successRate}%</p>
                    <p className="text-sm text-secondary/60">Success Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{signal.analystStats.totalSignals}</p>
                    <p className="text-sm text-secondary/60">Signals Published</p>
                  </div>
                  {signal.analystStats.totalPips != null && (
                    <div>
                      <p className="text-2xl font-bold">+{signal.analystStats.totalPips}</p>
                      <p className="text-sm text-secondary/60">Total Pips</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default SignalDetailAnalytics;
