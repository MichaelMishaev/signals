'use client';

import React, { useState, useEffect } from 'react';
import { LiveSignalToast, useLiveSignalToast } from './LiveSignalToast';
import { cn } from '@/utils/cn';

interface EmailConfirmationFlowProps {
  onEmailSubmit?: (email: string) => void;
  onEmailConfirmed?: () => void;
}

export const EmailConfirmationFlow: React.FC<EmailConfirmationFlowProps> = ({
  onEmailSubmit,
  onEmailConfirmed
}) => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    showToast,
    hideToast,
    confirmEmail,
    toastData,
    emailConfirmed,
    clickCount
  } = useLiveSignalToast();

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setEmailSubmitted(true);
    onEmailSubmit?.(email);

    // Simulate email being sent
    console.log('Email sent to:', email);
  };

  // Handle confirmation code submission
  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmationCode) return;

    setIsConfirming(true);

    // Simulate confirmation process
    setTimeout(() => {
      confirmEmail();
      onEmailConfirmed?.();
      setIsConfirming(false);
      console.log('Email confirmed! Toast will appear after 1 minute and 2 clicks.');
    }, 1000);
  };

  // Handle toast action
  const handleToastAction = () => {
    console.log('Opening trade for:', toastData);
    // Add your trade logic here
    hideToast();
  };

  return (
    <>
      {/* Email Submission Form */}
      {!emailSubmitted && !emailConfirmed && (
        <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-white text-lg font-bold mb-4">
            Get Live Trading Signals
          </h3>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
            >
              Send Confirmation Email
            </button>
          </form>
        </div>
      )}

      {/* Confirmation Code Form */}
      {emailSubmitted && !emailConfirmed && (
        <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-white text-lg font-bold mb-2">
            Check Your Email
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            We&apos;ve sent a confirmation code to {email}
          </p>
          <form onSubmit={handleConfirmation} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm text-gray-400 mb-2">
                Confirmation Code
              </label>
              <input
                type="text"
                id="code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter 6-digit code"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isConfirming}
              className={cn(
                "w-full px-4 py-2 font-bold rounded-lg transition-colors",
                isConfirming
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              )}
            >
              {isConfirming ? 'Confirming...' : 'Confirm Email'}
            </button>
          </form>
        </div>
      )}

      {/* Success Message */}
      {emailConfirmed && !showToast && (
        <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">
              Email Confirmed!
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              You&apos;ll receive a signal notification soon.
            </p>
            <div className="text-xs text-gray-500">
              Click around the site ({clickCount}/2 clicks)
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

export default EmailConfirmationFlow;