import { cn } from '@/utils/cn';
import RevealAnimation from '../animation/RevealAnimation';

const features = [
  {
    id: 1,
    title: 'Real-time Push Notifications',
    description:
      'Get instant alerts on your phone within 30 seconds of signal generation. Never miss a trading opportunity.',
    icon: '🔔',
    color: 'from-primary-400 to-primary-600',
  },
  {
    id: 2,
    title: 'Urdu & English Support',
    description: 'Complete platform available in both Urdu and English. Learn trading in your preferred language.',
    icon: '🌐',
    color: 'from-ns-cyan to-ns-green',
  },
  {
    id: 3,
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms analyze RSI, MACD, and MA crossovers to generate high-probability signals.',
    icon: '🤖',
    color: 'from-primary-500 to-primary-600',
  },
  {
    id: 4,
    title: 'Risk Management',
    description: 'Every signal includes stop-loss and take-profit levels. Maximum 2% risk per trade recommendation.',
    icon: '🛡️',
    color: 'from-ns-red to-red-600',
  },
  {
    id: 5,
    title: 'Pakistan Markets Focus',
    description: 'Specialized signals for PSX stocks, PKR pairs, and market timings aligned with Pakistan.',
    icon: '🇵🇰',
    color: 'from-ns-green to-primary-600',
  },
  {
    id: 6,
    title: 'Complete Transparency',
    description: 'Full trading history available. See all past signals, wins, losses, and performance metrics.',
    icon: '📊',
    color: 'from-primary-500 to-primary-700',
  },
];

const Features = () => {
  return (
    <section className="py-20 lg:py-[100px] xl:py-[120px] bg-background-3 dark:bg-background-6">
      <div className="main-container">
        <div className="space-y-5 mb-10 md:mb-[72px] text-center lg:max-w-[570px] lg:mx-auto">
          <RevealAnimation delay={0.1}>
            <span className="badge badge-primary">FEATURES</span>
          </RevealAnimation>
          <RevealAnimation delay={0.2}>
            <h2>Why Choose TradeSignal PK</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <p className="text-secondary/70">
              Built specifically for Pakistani traders with local market expertise and compliance
            </p>
          </RevealAnimation>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-0">
          {features.map((feature, index) => (
            <RevealAnimation key={feature.id} delay={0.4 + index * 0.1}>
              <article className="space-y-3 group hover:scale-105 transition-transform duration-300">
                <div
                  className={cn(
                    'rounded-[12px] overflow-hidden w-full h-[200px] bg-gradient-to-br flex items-center justify-center',
                    feature.color,
                  )}>
                  <span className="text-6xl">{feature.icon}</span>
                </div>
                <div className="max-md:space-y-0.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-secondary/70">{feature.description}</p>
                </div>
              </article>
            </RevealAnimation>
          ))}
        </div>

        {/* Additional Features Grid */}
        <RevealAnimation delay={1.0}>
          <div className="mt-16 bg-white dark:bg-background-5 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Platform Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '📱', title: 'PWA Mobile App', desc: 'Install on phone' },
                { icon: '💬', title: 'Signal Chat', desc: 'Discuss with traders' },
                { icon: '📈', title: 'Performance Stats', desc: 'Track your growth' },
                { icon: '🎯', title: 'Custom Alerts', desc: 'Set preferences' },
                { icon: '📚', title: 'Education', desc: 'Learn trading basics' },
                { icon: '🏦', title: 'Local Payments', desc: 'JazzCash, Easypaisa' },
                { icon: '⚡', title: 'Fast Execution', desc: 'Quick entry/exit' },
                { icon: '🔐', title: 'Secure Platform', desc: 'Bank-level security' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Features;
