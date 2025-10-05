'use client';

import { useState, useEffect } from 'react';
import { usePlatformDetection } from './usePlatformDetection';
import { bannerConfig, getAffiliateUrl } from './bannerConfig';
import { AdBannerProps } from './types';

/**
 * Unified AdBanner Component
 * Displays Exness advertising banners with automatic platform detection and rotation
 *
 * @param position - Banner position: 'side', 'footer', or 'between-signals'
 * @param className - Optional additional CSS classes
 * @param rotationInterval - Time in ms between rotations (default: 5000)
 */
export default function AdBanner({
  position,
  className = '',
  rotationInterval = 5000
}: AdBannerProps) {
  const platform = usePlatformDetection();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get banners for current platform and position
  const banners = bannerConfig[platform][position];
  const currentBanner = banners[currentIndex];

  // Rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [banners.length, rotationInterval]);

  // Get affiliate URL with tracking
  const affiliateUrl = getAffiliateUrl(platform, position);

  // Position-specific styling
  const getContainerStyles = () => {
    switch (position) {
      case 'side':
        return 'bg-background-3 dark:bg-background-7 rounded-xl p-2 md:p-4 shadow-lg';
      case 'footer':
        return 'bg-background-3 dark:bg-background-7 py-4 md:py-6 border-t border-gray-200 dark:border-gray-700';
      case 'between-signals':
        return 'bg-background-3 dark:bg-background-7 rounded-xl p-4 md:p-6 my-6 shadow-md';
      default:
        return '';
    }
  };

  // Position-specific layout
  const renderBanner = () => {
    if (position === 'footer') {
      return (
        <div className={`${getContainerStyles()} ${className}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-2 md:gap-4">
              {/* Sponsored Label */}
              <p className="text-[10px] md:text-xs text-secondary/60 dark:text-accent/60 uppercase tracking-wider">
                Sponsored
              </p>

              {/* Banner Image */}
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block hover:opacity-90 transition-opacity duration-200"
              >
                <img
                  src={currentBanner.src}
                  width={currentBanner.width}
                  height={currentBanner.height}
                  alt={currentBanner.alt}
                  className="rounded-lg shadow-lg w-full max-w-[970px] h-auto"
                />
              </a>

              {/* Risk Warning */}
              <p className="text-[10px] md:text-xs text-secondary/60 dark:text-accent/60">
                Risk warning: Trading involves substantial risk of loss
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (position === 'side') {
      return (
        <div className={`${getContainerStyles()} ${className}`}>
          {/* Header */}
          <div className="text-center mb-2 md:mb-4">
            <p className="text-xs md:text-sm font-semibold text-secondary dark:text-accent mb-1">
              Sponsored
            </p>
            <h3 className="text-sm md:text-lg font-bold text-primary-500">
              Trade with Exness
            </h3>
          </div>

          {/* Banner Image */}
          <div className="flex justify-center">
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block hover:opacity-90 transition-opacity duration-200"
            >
              <img
                src={currentBanner.src}
                width={currentBanner.width}
                height={currentBanner.height}
                alt={currentBanner.alt}
                className="rounded-lg shadow-md w-auto h-auto max-w-full max-h-[400px] md:max-h-[600px]"
              />
            </a>
          </div>

          {/* Footer Info */}
          <div className="mt-2 md:mt-4 text-center">
            <p className="text-[10px] md:text-xs text-secondary/60 dark:text-accent/60">
              Risk warning applies
            </p>
          </div>
        </div>
      );
    }

    if (position === 'between-signals') {
      return (
        <div className={`${getContainerStyles()} ${className}`}>
          <div className="flex flex-col items-center gap-3">
            {/* Sponsored Label */}
            <p className="text-xs text-secondary/60 dark:text-accent/60 uppercase tracking-wider">
              Sponsored
            </p>

            {/* Banner Image */}
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block hover:opacity-90 transition-opacity duration-200"
            >
              <img
                src={currentBanner.src}
                width={currentBanner.width}
                height={currentBanner.height}
                alt={currentBanner.alt}
                className="rounded-lg shadow-lg w-full max-w-[800px] h-auto"
              />
            </a>

            {/* Risk Warning */}
            <p className="text-xs text-secondary/60 dark:text-accent/60">
              Risk warning applies
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return renderBanner();
}
