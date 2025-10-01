'use client';

import React, { useState, useEffect } from 'react';
import { LiveSignalToast, useLiveSignalToast } from './LiveSignalToast';
import { cn } from '@/utils/cn';

interface StartTradingFlowProps {
  onStartTrading?: (email: string) => void;
}

export const StartTradingFlow: React.FC<StartTradingFlowProps> = ({
  onStartTrading
}) => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const {
    showToast,
    hideToast,
    handleStartTrading,
    buttonPressed,
    clickCount
  } = useLiveSignalToast();

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setEmailSubmitted(true);

    // Start the timer when email is submitted
    handleStartTrading();

    // Navigate to trading platform
    onStartTrading?.(email);

    // Open external trading link
    window.open('https://www.example.com/trade', '_blank');
  };

  // Handle toast action
  const handleToastAction = () => {
    console.log('Viewing market analysis');
    hideToast();
    // Navigate to analysis page
    window.open('https://www.example.com/analysis', '_blank');
  };

  return (
    <>
      {/* Start Trading Form */}
      {!emailSubmitted && !buttonPressed && (
        <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-white text-lg font-bold mb-2">
            Access Market Analysis
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Educational content for informational purposes only. Trading involves risk.
          </p>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                Email for Updates
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
            >
              Start Learning
            </button>
            <p className="text-gray-500 text-xs text-center">
              By continuing, you acknowledge market risks and that this is educational content only.
            </p>
          </form>
        </div>
      )}

      {/* Success Message */}
      {emailSubmitted && !showToast && (
        <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">
              Welcome to Market Analysis
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              You&apos;ll receive educational updates at {email}
            </p>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">
                Continue browsing. Analysis updates will appear periodically.
              </p>
              <div className="mt-2 text-xs text-gray-600">
                Activity: {clickCount} interactions
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Signal Toast */}
      {showToast && (
        <LiveSignalToast
          onClose={hideToast}
          onAction={handleToastAction}
        />
      )}
    </>
  );
};

export default StartTradingFlow;