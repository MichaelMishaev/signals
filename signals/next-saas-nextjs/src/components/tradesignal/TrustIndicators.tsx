import RevealAnimation from '../animation/RevealAnimation';

const TrustIndicators = () => {
  const stats = [
    {
      id: 1,
      value: '95%',
      label: 'Win Rate',
      description: '30-day average',
      icon: '📈',
      color: 'text-primary-600 dark:text-ns-green',
      bgColor: 'bg-ns-green-light dark:bg-ns-green/20',
    },
    {
      id: 2,
      value: '10,000+',
      label: 'Active Traders',
      description: 'From Pakistan',
      icon: '👥',
      color: 'text-primary-600 dark:text-ns-cyan',
      bgColor: 'bg-ns-cyan-light dark:bg-ns-cyan/20',
    },
    {
      id: 3,
      value: '24/7',
      label: 'Signal Coverage',
      description: 'All market sessions',
      icon: '🌍',
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      id: 4,
      value: '<30s',
      label: 'Alert Speed',
      description: 'Push notifications',
      icon: '⚡',
      color: 'text-primary-800 dark:text-ns-yellow',
      bgColor: 'bg-ns-yellow-light dark:bg-ns-yellow/20',
    },
    {
      id: 5,
      value: '₨500M+',
      label: 'Trading Volume',
      description: 'Monthly average',
      icon: '💰',
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    },
    {
      id: 6,
      value: '4.9/5',
      label: 'User Rating',
      description: 'Based on 5,000+ reviews',
      icon: '⭐',
      color: 'text-primary-600 dark:text-ns-red',
      bgColor: 'bg-ns-red/10 dark:bg-ns-red/20',
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-background-5">
      <div className="main-container">
        <div className="text-center space-y-3 mb-12">
          <RevealAnimation delay={0.1}>
            <span className="badge badge-primary">TRANSPARENCY & TRUST</span>
          </RevealAnimation>
          <RevealAnimation delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl">Why Traders Trust Us</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <p className="max-w-[600px] mx-auto text-secondary/70">
              Real performance metrics updated in real-time. Complete transparency, no hidden numbers.
            </p>
          </RevealAnimation>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <RevealAnimation key={stat.id} delay={0.4 + index * 0.1}>
              <div className="bg-background-2 dark:bg-background-6 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{stat.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.description}</p>
              </div>
            </RevealAnimation>
          ))}
        </div>

        {/* Live Performance Tracker */}
        <RevealAnimation delay={0.9}>
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Today&apos;s Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Signals</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winning Trades</span>
                    <span className="font-bold text-ns-green">21</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Losing Trades</span>
                    <span className="font-bold text-ns-red">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <span className="font-bold text-ns-yellow">1</span>
                  </div>
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex justify-between">
                      <span className="text-lg">Today&apos;s Win Rate</span>
                      <span className="text-2xl font-bold">91.3%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Recent Wins</h4>
                <div className="space-y-2">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">EUR/USD</span>
                      <span className="text-ns-green font-bold">+45 pips</span>
                    </div>
                    <span className="text-xs opacity-75">2 minutes ago</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">USD/PKR</span>
                      <span className="text-ns-green font-bold">+120 pips</span>
                    </div>
                    <span className="text-xs opacity-75">15 minutes ago</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">GOLD</span>
                      <span className="text-ns-green font-bold">+85 pips</span>
                    </div>
                    <span className="text-xs opacity-75">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealAnimation>

        {/* Trust Badges */}
        <RevealAnimation delay={1.0}>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h2a1 1 0 100-2 2 2 0 00-2 2v11a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Risk Management</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                <path d="M15 10.12l1.69-.724A11.115 11.115 0 0117 13.158a1 1 0 01-.89.89 8.968 8.968 0 00-1.05.174V10.12z" />
              </svg>
              <span className="font-medium">SECP Guidelines</span>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default TrustIndicators;
