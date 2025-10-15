'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface SignalSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignalSummaryModal = ({ isOpen, onClose }: SignalSummaryModalProps) => {
  const locale = useLocale();
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchSummary();
    }
  }, [isOpen]);

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await fetch('/api/signals/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error('Summary fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop with enhanced blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal with animation */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden animate-slideUp">
        {/* Header with icon and improved styling - No sticky on mobile */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white px-4 sm:px-8 py-4 sm:py-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              {/* Title */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Latest Signals Summary</h2>
                <p className="text-white/80 text-sm mt-1 font-medium">Real-time market analysis and opportunities</p>
              </div>
            </div>
            {/* Close button styled as button from image */}
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 transition-all duration-200 hover:scale-110 hover:rotate-90 group"
              aria-label="Close">
              <svg className="w-5 h-5 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content with improved styling */}
        <div className="overflow-y-auto max-h-[calc(85vh-200px)] px-4 sm:px-8 py-4 sm:py-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                {/* Spinning loader with gradient */}
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg font-medium">Analyzing latest market signals...</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">This will take just a moment</p>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-2 border-red-300 dark:border-red-700 rounded-2xl p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-red-800 dark:text-red-300 font-bold text-lg mb-1">Unable to Load Summary</h3>
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {summary && !loading && (
            <div className="space-y-4">
              {/* Content with improved typography */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-inner">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
                    {summary}
                  </div>
                </div>
              </div>

              {/* Risk disclaimer */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-semibold mb-1">Trading Risk Disclaimer</p>
                    <p className="text-xs leading-relaxed">Past performance is not indicative of future results. Trading carries risk. Always use proper risk management and never invest more than you can afford to lose.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with improved button - No sticky on mobile */}
        <div className="bg-white dark:bg-gray-900 px-4 sm:px-8 py-4 sm:py-5 border-t border-gray-200 dark:border-gray-700 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group">
            <span>Close</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignalSummaryModal;
