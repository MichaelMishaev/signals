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
  analysis: string;
  chart: string;
  keyLevels: {
    resistance: number[];
    support: number[];
  };
  riskManagement: {
    positionSize: string;
    maxRisk: string;
    rewardTarget: string;
  };
}

const SignalDetailCaseStudy = ({ signal }: { signal: SignalData }) => {
  const profitLoss = (signal.currentPrice - signal.entry) * (signal.action === 'BUY' ? 1 : -1);
  const profitLossPercentage = ((profitLoss / signal.entry) * 100 * 10000).toFixed(2); // For forex pips calculation

  return (
    <section className="pt-7 pb-24 md:pb-28 lg:pb-32 xl:pb-[200px]">
      <div className="main-container">
        <div className="space-y-[70px]">
          {/* Signal Header */}
          <div className="space-y-4">
            <RevealAnimation delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    signal.type === 'SIGNAL' ? 'bg-ns-green text-white' : 'bg-gray-200 text-gray-800'
                  }`}>
                  📈 {signal.type}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    signal.status === 'ACTIVE' ? 'bg-ns-yellow-light text-primary-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                  {signal.status}
                </span>
              </div>
            </RevealAnimation>

            <RevealAnimation delay={0.2}>
              <h1 className="text-heading-2 mb-4">{signal.title}</h1>
            </RevealAnimation>

            <RevealAnimation delay={0.3}>
              <div className="flex items-center gap-4 text-sm text-secondary/60">
                <div className="flex items-center gap-2">
                  <Image src={signal.authorImage} alt={signal.author} width={32} height={32} className="rounded-full" />
                  <span>by {signal.author}</span>
                </div>
                <span>•</span>
                <time>{signal.publishDate}</time>
                <span>•</span>
                <span>{signal.market}</span>
              </div>
            </RevealAnimation>
          </div>

          {/* Trading Chart */}
          <RevealAnimation delay={0.4}>
            <figure className="max-w-[1290px] max-h-[700px] overflow-hidden rounded-4xl">
              <div className="bg-gray-900 text-white p-8 text-center min-h-[400px] flex items-center justify-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{signal.pair} Trading Chart</h3>
                  <p className="text-gray-300">Interactive chart would be displayed here</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Entry: {signal.entry} | Current: {signal.currentPrice}
                  </p>
                </div>
              </div>
            </figure>
          </RevealAnimation>

          <div className="space-y-[72px] max-w-[950px] mx-auto">
            {/* Signal Analysis */}
            <RevealAnimation delay={0.5}>
              <div className="space-y-6">
                <h2 className="text-heading-3">Signal Analysis</h2>
                <p className="text-secondary dark:text-accent leading-relaxed">{signal.content}</p>

                {/* Key Signal Details */}
                <div className="bg-background-2 dark:bg-background-6 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xs text-secondary/60 dark:text-accent/60">Entry Price</p>
                      <p className="text-lg font-bold">{signal.entry.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary/60 dark:text-accent/60">Current Price</p>
                      <p className="text-lg font-bold text-primary-600">{signal.currentPrice.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary/60 dark:text-accent/60">Stop Loss</p>
                      <p className="text-lg font-bold text-red-600">{signal.stopLoss.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary/60 dark:text-accent/60">Take Profit</p>
                      <p className="text-lg font-bold text-ns-green">{signal.takeProfit.toFixed(4)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current P&L:</span>
                      <span className={`text-lg font-bold ${signal.pips > 0 ? 'text-ns-green' : 'text-red-600'}`}>
                        {signal.pips > 0 ? '+' : ''}
                        {signal.pips} pips ({profitLossPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </RevealAnimation>

            {/* Performance Metrics (Case Study Style) */}
            <div>
              <RevealAnimation delay={0.6}>
                <h3 className="text-heading-4 mb-6">Signal Performance</h3>
              </RevealAnimation>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-3">
                {/* Metrics Column */}
                <RevealAnimation delay={0.7}>
                  <div className="[&>p]:border-b [&>p]:border-b-stroke-4 dark:[&>p]:border-b-stroke-7 [&>p]:last:border-b-0">
                    <p className="py-4 text-secondary dark:text-accent font-medium">Metric</p>
                    <p className="py-4">Entry Price</p>
                    <p className="py-4">Current Price</p>
                    <p className="py-4">Profit/Loss</p>
                    <p className="py-4">Confidence Level</p>
                    <p className="py-4">Risk/Reward Ratio</p>
                  </div>
                </RevealAnimation>

                {/* Signal Entry */}
                <RevealAnimation delay={0.8}>
                  <div className="text-center px-6 bg-white dark:bg-background-6 rounded-[20px] [&>p]:border-b [&>p]:border-b-stroke-4 dark:[&>p]:border-b-stroke-7 [&>p]:last:border-b-0">
                    <p className="py-4 text-secondary font-medium dark:text-accent">Signal Entry</p>
                    <p className="py-4">{signal.entry.toFixed(4)}</p>
                    <p className="py-4">{signal.entry.toFixed(4)}</p>
                    <p className="py-4">0 pips</p>
                    <p className="py-4">{signal.confidence}%</p>
                    <p className="py-4">1:2.3</p>
                  </div>
                </RevealAnimation>

                {/* Current Status */}
                <RevealAnimation delay={0.9}>
                  <div className="text-center px-6 bg-white dark:bg-background-6 rounded-[20px] [&>p]:border-b [&>p]:border-b-stroke-4 dark:[&>p]:border-b-stroke-7 [&>p]:last:border-b-0">
                    <p className="py-4 text-secondary dark:text-accent font-medium">Current Status</p>
                    <p className="py-4">{signal.entry.toFixed(4)}</p>
                    <p className="py-4 font-bold text-primary-600">{signal.currentPrice.toFixed(4)}</p>
                    <p className={`py-4 font-bold ${signal.pips > 0 ? 'text-ns-green' : 'text-red-600'}`}>
                      {signal.pips > 0 ? '+' : ''}
                      {signal.pips} pips
                    </p>
                    <p className="py-4">{signal.confidence}%</p>
                    <p className="py-4">In Progress</p>
                  </div>
                </RevealAnimation>
              </div>
            </div>

            {/* Trader Testimonial */}
            <RevealAnimation delay={1.0}>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-xl p-8">
                <div className="text-center">
                  <blockquote className="text-lg italic mb-4">
                    &quot;This EUR/USD signal is performing exactly as predicted. The technical analysis was spot-on
                    with the RSI recovery and volume confirmation.&quot;
                  </blockquote>
                  <div className="flex items-center justify-center gap-3">
                    <Image
                      src={signal.authorImage}
                      alt={signal.author}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{signal.author}</p>
                      <p className="text-sm text-secondary/60">Senior FX Analyst</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealAnimation>

            {/* Risk Management */}
            <RevealAnimation delay={1.1}>
              <div className="space-y-6">
                <h4 className="text-heading-4">Risk Management Strategy</h4>
                <ul className="space-y-2">
                  <li>Position Size: {signal.riskManagement.positionSize}</li>
                  <li>Maximum Risk: {signal.riskManagement.maxRisk}</li>
                  <li>Reward Target: {signal.riskManagement.rewardTarget}</li>
                  <li>Risk/Reward Ratio: 1:2.3</li>
                </ul>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignalDetailCaseStudy;
