import { CheckIcon } from '@/icons';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const Hero = () => {
  return (
    <section className="md:mt-4 lg:mt-6 xl:mt-[30px]">
      <div className="max-w-[1860px] mx-auto pt-[170px] sm:pt-[190px] md:pt-[210px] lg:pt-[220px] pb-[80px] sm:pb-[100px] lg:pb-[200px] min-h-[600px] md:max-h-[940px] md:rounded-[30px] xl:rounded-[50px] relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 dark:from-primary-700 dark:via-primary-600 dark:to-primary-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Live Market Ticker */}
        <div className="absolute top-4 left-0 right-0 z-10">
          <div className="bg-black/30 backdrop-blur-sm text-white py-2 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="mx-4">🔴 USD/PKR: 285.50 (-0.25%)</span>
              <span className="mx-4">🟢 PSX: 45,250 (+1.2%)</span>
              <span className="mx-4">🟢 Gold: $1,950 (+0.8%)</span>
              <span className="mx-4">🔴 BTC: $42,500 (-2.1%)</span>
              <span className="mx-4">🟢 EUR/PKR: 310.25 (+0.5%)</span>
            </div>
          </div>
        </div>

        <div className="main-container relative z-10">
          <div className="space-y-3 md:space-y-5 text-center md:text-left max-w-full md:max-w-[800px]">
            <RevealAnimation delay={0.1}>
              <span className="inline-block text-xs sm:text-tagline-2 font-medium backdrop-blur-[18px] rounded-full px-3 sm:px-5 py-1.5 bg-ns-yellow/20 text-ns-yellow-light badge-yellow-v2">
                🎯 95% Win Rate • Trusted by 10,000+ Pakistani Traders
              </span>
            </RevealAnimation>
            <div className="space-y-2.5 md:space-y-4">
              <RevealAnimation delay={0.2}>
                <h1 className="max-w-full md:max-w-[800px] leading-[1.2] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="text-white block">Professional Trading Signals</span>
                  <span className="text-ns-yellow block mt-2">for Pakistani Markets</span>
                </h1>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <p className="text-white/90 max-w-full md:max-w-[600px] text-sm sm:text-base px-4 md:px-0">
                  Get real-time buy/sell signals with precise entry, stop-loss, and take-profit levels. Start with 3
                  free signals daily. Available in Urdu & English.
                </p>
              </RevealAnimation>
              <ul className="flex flex-col flex-wrap sm:flex-row items-center sm:items-start md:items-center gap-y-3 gap-x-4 sm:gap-x-9 mt-8 md:mt-[54px] px-4 md:px-0">
                <RevealAnimation delay={0.4}>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-ns-green/30">
                      <CheckIcon className="fill-white" />
                    </span>
                    <span className="text-white/90 text-xs sm:text-tagline-2">Real-time alerts</span>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.5}>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-ns-green/30">
                      <CheckIcon className="fill-white" />
                    </span>
                    <span className="text-white/90 text-xs sm:text-tagline-2">PSX & Forex signals</span>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.6}>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-ns-green/30">
                      <CheckIcon className="fill-white" />
                    </span>
                    <span className="text-white/90 text-xs sm:text-tagline-2">Risk management</span>
                  </li>
                </RevealAnimation>
              </ul>
            </div>
          </div>
          <ul className="flex flex-col sm:flex-row items-center sm:items-start gap-y-4 gap-x-4 justify-center sm:justify-start mt-12 md:mt-14 lg:mb-[100px] px-4 sm:px-0">
            <RevealAnimation delay={0.7} direction="left" offset={50}>
              <li className="w-full sm:w-auto">
                <LinkButton
                  href="/signup-01"
                  className="btn btn-primary hover:btn-white dark:hover:btn-white-dark mx-auto sm:mx-0 block md:inline-block w-[90%] md:w-auto btn-lg md:btn-xl border-0 font-bold">
                  Start Free Trial - 3 Signals Daily
                </LinkButton>
              </li>
            </RevealAnimation>
            <RevealAnimation delay={0.9} direction="left" offset={50}>
              <li className="w-full sm:w-auto">
                <LinkButton
                  href="/login-01"
                  className="btn btn-lg md:btn-xl btn-dark bg-white/20 backdrop-blur-sm mx-auto sm:mx-0 block md:inline-block w-[90%] md:w-auto hover:bg-white/30 text-white border-white/30">
                  View Live Signals
                </LinkButton>
              </li>
            </RevealAnimation>
          </ul>

          {/* Live Signal Notification */}
          <RevealAnimation delay={1.0}>
            <div className="mt-8 md:mt-0 md:absolute md:bottom-10 md:right-10 bg-white/95 dark:bg-black/80 backdrop-blur-md rounded-xl p-4 max-w-sm mx-auto md:mx-0 shadow-2xl animate-pulse-soft">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex size-3 bg-ns-green rounded-full animate-ping"></span>
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                  NEW SIGNAL • JUST NOW
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 dark:text-white">EUR/USD BUY Signal</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Entry: 1.0850 | SL: 1.0820 | TP: 1.0920</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Confidence: 87% • Risk/Reward: 1:2.3</p>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default Hero;
