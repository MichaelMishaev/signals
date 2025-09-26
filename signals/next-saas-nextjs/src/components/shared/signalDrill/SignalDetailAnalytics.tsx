import Image from 'next/image';
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
  // Chart image for visual display
  chartImage?: string;
  // Analyst additional info
  analystStats?: {
    successRate: number;
    totalSignals: number;
    totalPips: number;
  };
}

interface SignalDetailAnalyticsProps {
  signal: SignalData;
}

const SignalDetailAnalytics = ({ signal }: SignalDetailAnalyticsProps) => {
  const profitLoss = (signal.currentPrice - signal.entry) * (signal.action === 'BUY' ? 1 : -1);
  const riskRewardRatio = Math.abs((signal.takeProfit - signal.entry) / (signal.entry - signal.stopLoss));

  return (
    <section className="pt-[70px] pb-[100px] analytics">
      <div className="max-w-[1200px] w-[95%] mx-auto">
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
          <RevealAnimation delay={0.3}>
            <div className="bg-white dark:bg-background-6 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Price Movement Analytics</h2>

              {/* Chart Area - Now supports both image and placeholder */}
              <div className="bg-gray-900 rounded-lg p-6 mb-6 min-h-[400px] flex items-center justify-center">
                {signal.chartImage ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={signal.chartImage}
                      alt={`${signal.pair} Trading Chart`}
                      fill
                      className="object-contain rounded"
                      priority
                    />
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <h3 className="text-3xl font-bold mb-4">{signal.pair} Real-Time Chart</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Entry Point</p>
                        <p className="text-xl font-bold">{signal.entry.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Current Price</p>
                        <p className="text-xl font-bold text-ns-green">{signal.currentPrice.toFixed(4)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Price Change</p>
                        <p className={`text-xl font-bold ${profitLoss > 0 ? 'text-ns-green' : 'text-red-400'}`}>
                          {profitLoss > 0 ? '+' : ''}
                          {(profitLoss * 10000).toFixed(0)} pips
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Distance to Target</p>
                        <p className="text-xl font-bold text-ns-yellow">
                          {((signal.takeProfit - signal.currentPrice) * 10000).toFixed(0)} pips
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">Interactive candlestick chart with technical indicators</p>
                  </div>
                )}
              </div>

              {/* Key Levels Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>
          </RevealAnimation>

          {/* Performance Metrics */}
          <RevealAnimation delay={0.4}>
            <div className="bg-white dark:bg-background-6 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Performance Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Signal Quality Score */}
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${signal.confidence * 2.51}, 251`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{signal.confidence}%</span>
                    </div>
                  </div>
                  <h4 className="font-semibold">Signal Quality</h4>
                  <p className="text-sm text-secondary/60">Confidence Score</p>
                </div>

                {/* Risk Assessment */}
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#f59e0b"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="188, 251"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">75%</span>
                    </div>
                  </div>
                  <h4 className="font-semibold">Risk Level</h4>
                  <p className="text-sm text-secondary/60">Medium Risk</p>
                </div>

                {/* Profit Potential */}
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="226, 251"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">90%</span>
                    </div>
                  </div>
                  <h4 className="font-semibold">Profit Potential</h4>
                  <p className="text-sm text-secondary/60">High Probability</p>
                </div>
              </div>
            </div>
          </RevealAnimation>

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
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Current Price</span>
                      <span className="font-mono font-bold">{signal.currentPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Unrealized P&L</span>
                      <span className={`font-semibold ${signal.pips > 0 ? 'text-ns-green' : 'text-red-600'}`}>
                        {signal.pips > 0 ? '+' : ''}
                        {signal.pips} pips
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Time Active</span>
                      <span>4h 23m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary/60">Progress to Target</span>
                      <span>{((signal.pips / ((signal.takeProfit - signal.entry) * 10000)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>

          {/* Analyst Information */}
          <RevealAnimation delay={0.6}>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-xl p-8">
              <div className="flex items-center gap-4">
                <Image src={signal.authorImage} alt={signal.author} width={64} height={64} className="rounded-full" />
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
                  <div>
                    <p className="text-2xl font-bold">+{signal.analystStats.totalPips}</p>
                    <p className="text-sm text-secondary/60">Total Pips</p>
                  </div>
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
