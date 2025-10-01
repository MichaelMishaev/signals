'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';

interface LiveSignalToastProps {
  onClose?: () => void;
  onAction?: () => void;
}

// Hook for managing button press and toast display
export const useLiveSignalToast = () => {
  const [buttonPressed, setButtonPressed] = useState(false);
  const [pressTime, setPressTime] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [canShowToast, setCanShowToast] = useState(false);

  // Handle start trading button press
  const handleStartTrading = useCallback(() => {
    const now = Date.now();
    setButtonPressed(true);
    setPressTime(now);
    localStorage.setItem('tradingStartTime', now.toString());
    localStorage.setItem('clickCount', '0');

    // Start 1-minute timer
    setTimeout(() => {
      setCanShowToast(true);
      // Check if we already have enough clicks
      const storedClicks = parseInt(localStorage.getItem('clickCount') || '0');
      if (storedClicks >= 2) {
        setShowToast(true);
      }
    }, 60000); // 1 minute
  }, []);

  // Track user clicks
  const trackClick = useCallback(() => {
    setClickCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem('clickCount', newCount.toString());

      // Check if conditions are met
      if (canShowToast && newCount >= 2) {
        setShowToast(true);
      }

      return newCount;
    });
  }, [canShowToast]);

  // Check stored button press on mount
  useEffect(() => {
    const storedTime = localStorage.getItem('tradingStartTime');
    const storedClicks = localStorage.getItem('clickCount');

    if (storedTime) {
      const time = parseInt(storedTime);
      setButtonPressed(true);
      setPressTime(time);

      if (storedClicks) {
        setClickCount(parseInt(storedClicks));
      }

      // Check if enough time has passed
      const timeSincePress = Date.now() - time;
      if (timeSincePress >= 60000) {
        setCanShowToast(true);
        if (parseInt(storedClicks || '0') >= 2) {
          setShowToast(true);
        }
      } else {
        // Set timer for remaining time
        const remainingTime = 60000 - timeSincePress;
        setTimeout(() => {
          setCanShowToast(true);
          const currentClicks = parseInt(localStorage.getItem('clickCount') || '0');
          if (currentClicks >= 2) {
            setShowToast(true);
          }
        }, remainingTime);
      }
    }
  }, []);

  // Track clicks globally
  useEffect(() => {
    const handleGlobalClick = () => {
      trackClick();
    };

    if (buttonPressed && !showToast) {
      document.addEventListener('click', handleGlobalClick);
      return () => document.removeEventListener('click', handleGlobalClick);
    }
  }, [buttonPressed, showToast, trackClick]);

  const hideToast = () => setShowToast(false);

  return {
    showToast,
    hideToast,
    handleStartTrading,
    trackClick,
    buttonPressed,
    clickCount
  };
};

// Live Signal Toast Component
export const LiveSignalToast: React.FC<LiveSignalToastProps> = ({
  onClose,
  onAction
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleAction = () => {
    onAction?.();
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 max-w-sm",
      "animate-slideInDown transition-all duration-300",
      !isVisible && "animate-slideOutUp"
    )}>
      <div className="bg-gray-800 border border-blue-500 rounded-lg shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-bold text-sm">ANALYSIS</h4>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                INFO
              </span>
            </div>
            <p className="text-gray-400 text-xs mb-1">
              Market analysis available. Educational purposes only.
            </p>
            <p className="text-gray-500 text-[10px] mb-2">
              Past performance doesn't guarantee future results.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleClose}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleAction}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold transition-colors"
              >
                View
              </button>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSignalToast;