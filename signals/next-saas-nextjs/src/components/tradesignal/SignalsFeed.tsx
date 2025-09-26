'use client';

import { useState, useEffect } from 'react';
import RevealAnimation from '../animation/RevealAnimation';
import { SignalData } from '@/utils/supabase';

const SignalsFeed = () => {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<string>('ALL');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Fetch signals from API
  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch('/api/signals?limit=5&status=ACTIVE');
        const data = await response.json();
        setSignals(data.signals || []);
      } catch (error) {
        console.error('Error fetching signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  const filteredSignals = selectedMarket === 'ALL' ? signals : signals.filter((s) => s.market === selectedMarket);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-ns-yellow-light text-primary-800 dark:bg-ns-yellow/20 dark:text-ns-yellow';
      case 'CLOSED':
        return 'bg-ns-green-light text-primary-800 dark:bg-ns-green/20 dark:text-ns-green';
      case 'CANCELLED':
        return 'bg-background-11/20 text-secondary dark:bg-background-11/10 dark:text-accent/70';
      default:
        return 'bg-background-11/20 text-secondary';
    }
  };

  const getSignalTypeStyles = (action: string) => {
    return action === 'BUY'
      ? 'text-primary-600 dark:text-ns-green font-bold'
      : 'text-red-600 dark:text-ns-red font-bold';
  };

  return (
    <div className="p-6 bg-white dark:bg-background-6 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <RevealAnimation delay={0.1}>
          <span className="badge badge-primary text-xs">LIVE SIGNALS</span>
        </RevealAnimation>
        <RevealAnimation delay={0.2}>
          <h3 className="text-lg font-bold">Latest Trading Signals</h3>
        </RevealAnimation>
        <RevealAnimation delay={0.3}>
          <p className="text-xs text-secondary/70">Real-time signals with entry, SL & TP levels</p>
        </RevealAnimation>
      </div>

      {/* Market Filter */}
      <RevealAnimation delay={0.4}>
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          {['ALL', 'FOREX', 'CRYPTO', 'PSX'].map((market) => (
            <button
              key={market}
              onClick={() => setSelectedMarket(market)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                selectedMarket === market
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-background-5 text-secondary dark:text-accent/70 hover:bg-background-3 dark:hover:bg-background-5'
              }`}>
              {market === 'PSX' ? 'PSX' : market}
            </button>
          ))}
        </div>
      </RevealAnimation>

      {/* Signals List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-secondary/60 mt-2">Loading signals...</p>
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-secondary/60">No signals available</p>
          </div>
        ) : (
          filteredSignals.slice(0, 2).map((signal, index) => (
            <RevealAnimation key={signal.id} delay={0.5 + index * 0.1}>
              <div className="bg-gray-50 dark:bg-background-5 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                {/* Signal Header */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{signal.pair}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(signal.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(signal.status)}`}>
                    {signal.status}
                  </span>
                </div>

                {/* Signal Type & Confidence */}
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-lg ${getSignalTypeStyles(signal.action)}`}>{signal.action}</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{signal.confidence}%</span>
                </div>

                {/* Entry, SL, TP */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Entry</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {signal.entry.toFixed(signal.pair.includes('PKR') ? 2 : 4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">SL</span>
                    <span className="font-semibold text-red-600 dark:text-ns-red">
                      {signal.stop_loss.toFixed(signal.pair.includes('PKR') ? 2 : 4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">TP</span>
                    <span className="font-semibold text-primary-600 dark:text-ns-green">
                      {signal.take_profit.toFixed(signal.pair.includes('PKR') ? 2 : 4)}
                    </span>
                  </div>
                </div>
              </div>
            </RevealAnimation>
          ))
        )}
      </div>

      {/* Premium Features Section */}
      <RevealAnimation delay={0.7}>
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-lg border border-primary-200 dark:border-primary-700">
          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              For Subscribers Only
            </div>
          </div>

          {/* Premium Features List */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-primary-700 dark:text-primary-300">Advanced Technical Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-primary-700 dark:text-primary-300">Market Sentiment Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-primary-700 dark:text-primary-300">Real-time Push Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-primary-700 dark:text-primary-300">Unlimited Signal History</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-primary-700 dark:text-primary-300">Premium Support Channel</span>
            </div>
          </div>

          {/* Upgrade Button */}
          <button onClick={() => setShowPremiumModal(true)} className="btn btn-primary btn-sm w-full text-xs mt-4">
            Upgrade to Premium
          </button>
        </div>
      </RevealAnimation>

      {/* View All Signals Button */}
      <RevealAnimation delay={0.8}>
        <div className="text-center mt-4">
          <button onClick={() => setShowPremiumModal(true)} className="btn btn-secondary btn-sm w-full text-xs">
            View All Signals
          </button>
        </div>
      </RevealAnimation>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-background-6 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Upgrade to Premium</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-500" />
                <span>Unlimited daily signals</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-500" />
                <span>Full signal history & analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-500" />
                <span>Real-time push notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-500" />
                <span>Premium chat access</span>
              </li>
            </ul>
            <div className="flex gap-3">
              <button onClick={() => setShowPremiumModal(false)} className="btn btn-secondary flex-1">
                Maybe Later
              </button>
              <a href="/pricing-01" className="btn btn-primary flex-1">
                View Plans
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add CheckIcon component if not already imported
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default SignalsFeed;
