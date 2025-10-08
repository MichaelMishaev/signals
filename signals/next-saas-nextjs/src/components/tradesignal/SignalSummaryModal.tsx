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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-background-8 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">📊 Latest Signals Summary</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Analyzing latest signals...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {summary && !loading && (
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-background-2 dark:bg-background-7 rounded-xl p-6 whitespace-pre-wrap">
                {summary}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background-2 dark:bg-background-7 px-6 py-4 rounded-b-2xl border-t border-stroke-1/10">
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="btn btn-sm btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalSummaryModal;
