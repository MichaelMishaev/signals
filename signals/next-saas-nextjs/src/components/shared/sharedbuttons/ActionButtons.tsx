'use client';

import React from 'react';
import { cn } from '@/utils/cn';

/**
 * ActionButtons - High-converting CTA buttons for trading actions
 * Designs: 1-Urgent Countdown, 2-Live Market Pulse, 3-Profit Alert, 11-Rocket Launch
 */

export type ActionButtonVariant = 'urgent-countdown' | 'live-pulse' | 'profit-alert' | 'rocket-launch';

interface ActionButtonProps {
  variant?: ActionButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  customText?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'urgent-countdown',
  onClick,
  disabled = false,
  className,
  fullWidth = false,
  size = 'md',
  children,
  customText,
}) => {
  const sizeClasses = {
    sm: 'py-2 px-3 text-xs md:py-2.5 md:px-4 md:text-sm',
    md: 'py-2.5 px-4 text-sm md:py-3 md:px-5 md:text-base lg:py-3.5 lg:px-6',
    lg: 'py-3 px-5 text-base md:py-3.5 md:px-6 md:text-lg lg:py-4 lg:px-8',
  };

  const baseClasses = cn(
    'relative font-bold rounded-lg overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth ? 'w-full' : 'inline-block',
    sizeClasses[size],
    className
  );

  // Button 1: Urgent Countdown
  if (variant === 'urgent-countdown') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses,
          'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:scale-105 animate-urgent-pulse'
        )}
      >
        <span className="absolute top-0 left-0 flex items-center px-1 py-0.5 sm:px-1.5 md:px-2 md:py-1 bg-yellow-400 text-black text-[9px] sm:text-[10px] md:text-xs font-bold rounded-br-lg whitespace-nowrap">
          <span className="hidden sm:inline">LIMITED </span>TIME
        </span>
        <span className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 mt-1 sm:mt-1.5 md:mt-2">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
          </svg>
          <span className="font-black truncate">{customText || children || 'OPEN TRADE NOW'}</span>
          <span className="text-yellow-300 font-black hidden sm:inline">↗</span>
        </span>
        <div className="absolute bottom-0 left-0 h-0.5 md:h-1 bg-yellow-400 animate-countdown-bar"></div>
      </button>
    );
  }

  // Button 2: Live Market Pulse
  if (variant === 'live-pulse') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses,
          'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105 pattern-dots group'
        )}
      >
        <span className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}></span>
        <span className="absolute top-0 right-0 flex items-center gap-0.5 px-1 py-0.5 sm:px-1.5 md:px-2 md:py-1 bg-red-500 text-white text-[9px] sm:text-[10px] md:text-xs font-bold rounded-bl-lg">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></span>
          LIVE
        </span>
        <span className="relative flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <span className="font-black truncate">{customText || children || 'START TRADING NOW'}</span>
          <span className="text-[9px] sm:text-[10px] md:text-xs bg-white/20 px-1 py-0.5 sm:px-1.5 md:px-2 md:py-1 rounded hidden sm:inline-block">+24.5%</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-shimmer"></div>
      </button>
    );
  }

  // Button 3: Profit Alert
  if (variant === 'profit-alert') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses,
          'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-black hover:scale-105 hover:animate-shake'
        )}
      >
        <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 md:-top-3 md:-right-3 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-red-600 text-white text-[9px] sm:text-[10px] md:text-xs font-bold rounded-full animate-bounce">
          HOT!
        </span>
        <span className="relative flex flex-col items-center">
          <span className="text-[9px] sm:text-[10px] md:text-xs mb-0.5 sm:mb-1 opacity-90 hidden sm:block">💰 HIGH PROFIT</span>
          <span className="font-black flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <span className="truncate">{customText || children || 'TRADE NOW'}</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 inline flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
            </svg>
          </span>
        </span>
      </button>
    );
  }

  // Button 11: Rocket Launch
  if (variant === 'rocket-launch') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses,
          'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white hover:scale-105 md:hover:scale-110 group'
        )}
      >
        <span className="absolute inset-0 bg-black/20 opacity-30" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}></span>
        <span className="relative flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
          <span className="text-base sm:text-xl md:text-2xl group-hover:animate-bounce">🚀</span>
          <span className="flex flex-col items-start">
            <span className="text-[9px] sm:text-[10px] md:text-xs text-yellow-300 hidden sm:block">LAUNCH</span>
            <span className="font-black truncate">{customText || children || 'TRADE NOW'}</span>
          </span>
        </span>
        <div className="absolute -bottom-1 left-0 right-0 h-1 md:h-1.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse"></div>
      </button>
    );
  }

  return null;
};

// Export all variants as named components for easy access
export const UrgentCountdownButton: React.FC<Omit<ActionButtonProps, 'variant'>> = (props) => (
  <ActionButton {...props} variant="urgent-countdown" />
);

export const LivePulseButton: React.FC<Omit<ActionButtonProps, 'variant'>> = (props) => (
  <ActionButton {...props} variant="live-pulse" />
);

export const ProfitAlertButton: React.FC<Omit<ActionButtonProps, 'variant'>> = (props) => (
  <ActionButton {...props} variant="profit-alert" />
);

export const RocketLaunchButton: React.FC<Omit<ActionButtonProps, 'variant'>> = (props) => (
  <ActionButton {...props} variant="rocket-launch" />
);

// Default export for convenience
export default ActionButton;