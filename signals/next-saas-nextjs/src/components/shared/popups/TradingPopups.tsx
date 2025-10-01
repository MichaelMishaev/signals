'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

export type PopupVariant =
  | 'profit-alert'
  | 'welcome-bonus'
  | 'live-signal'
  | 'exit-intent'
  | 'cookie-consent'
  | 'account-verification'
  | 'market-alert'
  | 'newsletter'
  | 'success'
  | 'feedback';

interface PopupConfig {
  variant: PopupVariant;
  showDelay?: number; // milliseconds to wait before showing
  autoDismiss?: number; // milliseconds to auto-close (0 = manual close only)
  frequency?: 'once' | 'session' | 'daily' | 'always';
  onClose?: () => void;
  onAction?: () => void;
  data?: any; // Custom data for the popup content
}

interface PopupProps extends PopupConfig {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const TradingPopup: React.FC<PopupProps> = ({
  variant,
  isOpen,
  setIsOpen,
  showDelay = 0,
  autoDismiss = 0,
  frequency = 'always',
  onClose,
  onAction,
  data = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && showDelay > 0) {
      const timer = setTimeout(() => setIsVisible(true), showDelay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(isOpen);
    }
  }, [isOpen, showDelay]);

  useEffect(() => {
    if (isVisible && autoDismiss > 0) {
      const timer = setTimeout(() => handleClose(), autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoDismiss]);

  const handleClose = () => {
    setIsVisible(false);
    setIsOpen(false);
    onClose?.();
  };

  const handleAction = () => {
    onAction?.();
    handleClose();
  };

  if (!isVisible) return null;

  // Profit Alert Modal
  if (variant === 'profit-alert') {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={handleClose} />
        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto z-50 animate-scaleIn">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-1">
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6">
              <div className="h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-countdown" />
              </div>
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-2xl sm:text-3xl">💰</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">High Profit Alert!</h2>
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  {data.pair || 'EUR/USD'} showing {data.confidence || 89}% win probability
                </p>
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="text-gray-400">Entry:</span>
                    <span className="text-white font-bold">{data.entry || '1.0850'}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="text-gray-400">Take Profit:</span>
                    <span className="text-green-400 font-bold">{data.takeProfit || '1.0920'}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-400">Stop Loss:</span>
                    <span className="text-red-400 font-bold">{data.stopLoss || '1.0820'}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleClose} className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors">
                    Skip
                  </button>
                  <button onClick={handleAction} className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-lg transition-all transform hover:scale-105">
                    Trade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Welcome Bonus Popup
  if (variant === 'welcome-bonus') {
    return (
      <div className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-sm z-50 animate-slideInUp">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:rounded-xl shadow-2xl">
          <button onClick={handleClose} className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-xl">×</span>
          </button>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-base sm:text-lg mb-1">Welcome Gift!</h3>
              <p className="text-white/90 text-xs sm:text-sm mb-3">Get $100 bonus credits on your first deposit!</p>
              <button onClick={handleAction} className="px-4 py-2 bg-white text-purple-600 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                Claim Now →
              </button>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-white/70 text-xs">Limited time offer • Expires in 24 hours</p>
          </div>
        </div>
      </div>
    );
  }

  // Live Signal Toast
  if (variant === 'live-signal') {
    return (
      <div className="fixed top-4 right-4 z-50 max-w-sm animate-slideInDown">
        <div className="bg-gray-800 border border-green-500 rounded-lg shadow-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-bold text-sm">NEW SIGNAL</h4>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">LIVE</span>
              </div>
              <p className="text-gray-400 text-xs mb-2">{data.signal || 'BTC/USDT Buy Signal Generated'}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Entry:</span>
                <span className="text-white font-mono">{data.entry || '45,250'}</span>
                <span className="text-green-400">↑ {data.change || '2.5%'}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={handleClose} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors">
                  Dismiss
                </button>
                <button onClick={handleAction} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-bold transition-colors">
                  View Signal
                </button>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exit Intent Popup
  if (variant === 'exit-intent') {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={handleClose} />
        <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full z-50 animate-scaleIn">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 h-full sm:h-auto flex flex-col justify-center">
            <div className="text-center">
              <div className="text-5xl sm:text-6xl mb-4 animate-shake">👋</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Wait! Don't Go!</h2>
              <p className="text-gray-400 mb-6">Get exclusive access to VIP signals for the next 24 hours!</p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 font-bold text-lg mb-1">LIMITED TIME OFFER</p>
                <p className="text-white text-2xl font-black">50% OFF</p>
                <p className="text-gray-400 text-sm">Premium Membership</p>
              </div>
              <div className="space-y-3">
                <button onClick={handleAction} className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors transform hover:scale-105">
                  Claim Your Discount
                </button>
                <button onClick={handleClose} className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors">
                  No thanks, I'll pass
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Cookie Consent Banner
  if (variant === 'cookie-consent') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideInUp">
        <div className="bg-gray-900 border-t border-gray-800 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-white text-sm sm:text-base mb-2">
                  🍪 We use cookies to enhance your trading experience
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  By continuing, you agree to our use of cookies for analytics and personalization.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Settings
                </button>
                <button onClick={handleAction} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors">
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success Notification
  if (variant === 'success') {
    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-scaleIn">
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-green-500/30 max-w-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{data.title || 'Trade Executed!'}</h3>
            <p className="text-gray-400 mb-6">{data.message || 'Your position has been opened successfully'}</p>
            <button onClick={handleClose} className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors">
              {data.buttonText || 'Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Hook for managing popup state with timer functionality
export const usePopup = (config: PopupConfig) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const showPopup = () => {
    // Check frequency settings
    if (config.frequency === 'once' && hasShown) return;

    setIsOpen(true);
    setHasShown(true);
  };

  const hidePopup = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    showPopup,
    hidePopup,
    PopupComponent: (props: Partial<PopupProps>) => (
      <TradingPopup
        {...config}
        {...props}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    ),
  };
};

export default TradingPopup;