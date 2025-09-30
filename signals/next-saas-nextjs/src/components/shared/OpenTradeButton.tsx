'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface OpenTradeButtonProps {
  variant?:
    | 'gradient-pulse'
    | 'neon-glow'
    | 'outlined'
    | '3d-depth'
    | 'split-color'
    | 'animated-border'
    | 'neumorphism'
    | 'glassmorphism'
    | 'minimal'
    | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const OpenTradeButton: React.FC<OpenTradeButtonProps> = ({
  variant = 'gradient-pulse',
  size = 'md',
  fullWidth = false,
  icon = true,
  className,
  children = 'Open Trade Now',
  onClick,
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
    xl: 'py-5 px-10 text-xl',
  };

  const baseClasses = cn(
    'relative font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
    fullWidth ? 'w-full' : 'inline-block',
    sizeClasses[size]
  );

  const variantStyles = {
    'gradient-pulse': cn(
      baseClasses,
      'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
      'hover:shadow-xl transform hover:-translate-y-1',
      'animate-pulse-slow'
    ),
    'neon-glow': cn(
      baseClasses,
      'bg-blue-600 text-white shadow-lg',
      'hover:bg-blue-700 hover:shadow-blue-500/50',
      'animate-glow'
    ),
    'outlined': cn(
      baseClasses,
      'border-2 border-purple-600 text-purple-600',
      'hover:bg-purple-600 hover:text-white transform hover:scale-105'
    ),
    '3d-depth': cn(
      baseClasses,
      'bg-green-500 text-white',
      'shadow-[0_5px_0_0_#16a34a]',
      'hover:shadow-[0_2px_0_0_#16a34a] hover:translate-y-[3px]',
      'active:shadow-[0_0px_0_0_#16a34a] active:translate-y-[5px]'
    ),
    'split-color': cn(
      baseClasses,
      'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      'hover:shadow-2xl hover:from-orange-600 hover:to-red-600'
    ),
    'animated-border': cn(
      baseClasses,
      'bg-indigo-600 text-white overflow-hidden group',
      'hover:bg-indigo-700',
      'before:absolute before:inset-0 before:border-2 before:border-white',
      'before:opacity-0 hover:before:opacity-100 before:scale-95',
      'hover:before:scale-105 before:transition-all before:duration-300'
    ),
    'neumorphism': cn(
      baseClasses,
      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100',
      'shadow-[5px_5px_15px_#bebebe,-5px_-5px_15px_#ffffff]',
      'dark:shadow-[5px_5px_15px_#0f172a,-5px_-5px_15px_#2d3748]',
      'hover:shadow-[inset_5px_5px_15px_#bebebe,inset_-5px_-5px_15px_#ffffff]',
      'dark:hover:shadow-[inset_5px_5px_15px_#0f172a,inset_-5px_-5px_15px_#2d3748]'
    ),
    'glassmorphism': cn(
      baseClasses,
      'backdrop-blur-md bg-white/30 border border-white/50 text-white',
      'hover:bg-white/40 transform hover:scale-105'
    ),
    'minimal': cn(
      baseClasses,
      'bg-black dark:bg-white text-white dark:text-black rounded-full',
      'hover:rounded-lg hover:shadow-2xl'
    ),
    'premium': cn(
      baseClasses,
      'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white',
      'group overflow-hidden',
      'hover:shadow-2xl'
    ),
  };

  const renderIcon = () => {
    if (!icon) return null;

    if (variant === 'split-color') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }

    return (
      <svg
        className={cn(
          "w-5 h-5 inline-block ml-2",
          variant === 'premium' && "transform group-hover:translate-x-2 transition-transform duration-300"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    );
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(variantStyles[variant], className)}
    >
      {variant === 'animated-border' || variant === 'premium' ? (
        <span className="relative z-10 flex items-center justify-center gap-2">
          {variant === 'split-color' && icon && renderIcon()}
          {children}
          {variant !== 'split-color' && icon && renderIcon()}
        </span>
      ) : (
        <>
          {variant === 'split-color' && icon && renderIcon()}
          {children}
          {variant !== 'split-color' && icon && renderIcon()}
        </>
      )}
      {variant === 'premium' && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-orange-700 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      {variant === 'neon-glow' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer" />
      )}
    </button>
  );
};

export default OpenTradeButton;