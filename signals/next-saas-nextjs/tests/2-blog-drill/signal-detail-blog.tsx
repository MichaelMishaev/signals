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
}

const SignalDetailBlog = ({ signal }: { signal: SignalData }) => {
  return (
    <section className="pt-7 pb-14 md:pb-16 lg:pb-[88px] xl:pb-[200px]">
      <div className="main-container">
        <div className="space-y-3 max-w-[1209px] mx-auto">
          {/* Signal Header */}
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
              <span
                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  signal.pips > 0 ? 'bg-ns-green-light text-primary-800' : 'bg-ns-red/20 text-red-800'
                }`}>
                {signal.pips > 0 ? '+' : ''}
                {signal.pips} pips
              </span>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.1}>
            <h2 className="max-w-[884px]">{signal.title}</h2>
          </RevealAnimation>

          <div className="flex items-center gap-3">
            <RevealAnimation delay={0.2}>
              <figure className="size-12 rounded-full overflow-hidden bg-[#ECEAED]">
                <Image
                  src={signal.authorImage}
                  className="object-center object-cover"
                  alt={`${signal.author}'s avatar`}
                  width={48}
                  height={48}
                  loading="lazy"
                />
              </figure>
            </RevealAnimation>
            <div>
              <RevealAnimation delay={0.3}>
                <h3 className="text-tagline-1 font-medium">{signal.author}</h3>
              </RevealAnimation>
              <RevealAnimation delay={0.4}>
                <time
                  dateTime={signal.publishDate}
                  className="text-tagline-2 flex items-center gap-2 font-normal text-secondary/60 dark:text-accent/60">
                  {signal.publishDate} <span>•</span> {signal.market} <span>•</span> {signal.confidence}% Confidence
                </time>
              </RevealAnimation>
            </div>
          </div>
        </div>

        {/* Trading Chart */}
        <RevealAnimation delay={0.4}>
          <figure className="max-w-full rounded-lg md:rounded-4xl my-10 md:my-[70px] overflow-hidden">
            <div className="bg-gray-900 text-white p-8 text-center min-h-[500px] flex flex-col items-center justify-center">
              <h3 className="text-3xl font-bold mb-4">{signal.pair} Live Chart</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-6">
                <div>
                  <p className="text-xs text-gray-400">Entry</p>
                  <p className="text-xl font-bold text-white">{signal.entry.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Current</p>
                  <p className="text-xl font-bold text-ns-green">{signal.currentPrice.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Stop Loss</p>
                  <p className="text-xl font-bold text-red-400">{signal.stopLoss.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Target</p>
                  <p className="text-xl font-bold text-ns-yellow">{signal.takeProfit.toFixed(4)}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Real-time price movement and technical indicators</p>
                <p className={`text-2xl font-bold mt-2 ${signal.pips > 0 ? 'text-ns-green' : 'text-red-400'}`}>
                  Current P&L: {signal.pips > 0 ? '+' : ''}
                  {signal.pips} pips
                </p>
              </div>
            </div>
          </figure>
        </RevealAnimation>

        {/* Signal Analysis */}
        <RevealAnimation delay={0.5}>
          <article className="details-body max-w-[950px] mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Signal Overview</h3>
              <p className="text-lg leading-relaxed text-secondary dark:text-accent mb-6">{signal.content}</p>

              {/* Signal Metrics */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-xl p-6 mb-8">
                <h4 className="text-xl font-bold mb-4">Key Signal Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-secondary/60">Action</p>
                    <p className={`text-lg font-bold ${signal.action === 'BUY' ? 'text-ns-green' : 'text-red-600'}`}>
                      {signal.action}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary/60">Confidence</p>
                    <p className="text-lg font-bold">{signal.confidence}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary/60">Risk/Reward</p>
                    <p className="text-lg font-bold">1:2.3</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-secondary/60">Status</p>
                    <p className="text-lg font-bold text-ns-yellow">{signal.status}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4">Technical Analysis</h3>
              <div className="space-y-4 mb-8">
                <h4 className="text-xl font-semibold">Key Indicators:</h4>
                <ul className="space-y-2 pl-4">
                  <li>
                    • <strong>RSI</strong>: Recovering from oversold territory (32 → 45)
                  </li>
                  <li>
                    • <strong>MACD</strong>: Bullish crossover confirmed
                  </li>
                  <li>
                    • <strong>Support Level</strong>: Strong support at 1.0820
                  </li>
                  <li>
                    • <strong>Volume</strong>: Increasing buying volume
                  </li>
                </ul>

                <h4 className="text-xl font-semibold">Market Sentiment:</h4>
                <ul className="space-y-2 pl-4">
                  <li>• ECB policy stance remains hawkish</li>
                  <li>• USD weakness following Fed minutes</li>
                  <li>• Risk-on sentiment supporting EUR</li>
                </ul>

                <h4 className="text-xl font-semibold">Entry Strategy:</h4>
                <p>Entry at current levels with tight stop loss provides excellent risk-reward ratio of 1:2.3</p>
              </div>

              {/* Live Performance Section */}
              <div className="bg-background-2 dark:bg-background-6 rounded-xl p-6">
                <h4 className="text-xl font-bold mb-4">Live Performance Tracking</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-2">Entry Levels</h5>
                    <ul className="space-y-1 text-sm">
                      <li>Entry: {signal.entry.toFixed(4)}</li>
                      <li>
                        Stop Loss: <span className="text-red-600">{signal.stopLoss.toFixed(4)}</span>
                      </li>
                      <li>
                        Take Profit: <span className="text-ns-green">{signal.takeProfit.toFixed(4)}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Current Status</h5>
                    <ul className="space-y-1 text-sm">
                      <li>
                        Current Price: <span className="font-bold">{signal.currentPrice.toFixed(4)}</span>
                      </li>
                      <li>
                        Unrealized P&L:{' '}
                        <span className={signal.pips > 0 ? 'text-ns-green' : 'text-red-600'}>
                          {signal.pips > 0 ? '+' : ''}
                          {signal.pips} pips
                        </span>
                      </li>
                      <li>Distance to TP: {((signal.takeProfit - signal.currentPrice) * 10000).toFixed(0)} pips</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </RevealAnimation>

        {/* Social Share & Comments Section */}
        <RevealAnimation delay={0.6}>
          <div className="max-w-[950px] mx-auto space-y-8">
            {/* Share Links */}
            <div className="border-t border-b py-6">
              <h4 className="text-lg font-semibold mb-4">Share This Signal</h4>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Share on Twitter</button>
                <button className="bg-blue-800 text-white px-4 py-2 rounded text-sm">Share on Facebook</button>
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">Share on WhatsApp</button>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h4 className="text-xl font-bold mb-4">Trader Discussion ({3} comments)</h4>
              <div className="space-y-4">
                <div className="bg-background-2 dark:bg-background-6 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div>
                      <p className="font-semibold">Mike Trader</p>
                      <p className="text-sm text-secondary/60">2 hours ago</p>
                      <p className="mt-2">
                        Great analysis! Already in profit with this signal. The RSI confirmation was key.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background-2 dark:bg-background-6 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-ns-green rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold">Sarah FX</p>
                      <p className="text-sm text-secondary/60">1 hour ago</p>
                      <p className="mt-2">Watching this closely. The volume spike at entry was perfect timing!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h5 className="font-semibold mb-2">Add a comment</h5>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                  placeholder="Share your thoughts on this signal..."></textarea>
                <button className="mt-2 bg-primary-600 text-white px-4 py-2 rounded">Post Comment</button>
              </div>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default SignalDetailBlog;
