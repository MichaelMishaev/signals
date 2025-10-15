'use client';

import { useState, useEffect, useRef } from 'react';
import { usePlatformDetection } from './usePlatformDetection';
import { bannerConfig, getAffiliateUrl } from './bannerConfig';
import { AdBannerProps } from './types';

/**
 * Unified AdBanner Component - Optimized for slow internet (Pakistan)
 * Features:
 * - Platform detection (User Agent + viewport)
 * - Lazy loading (only load visible banners)
 * - Loading skeleton for slow connections
 * - Ad blocker detection
 * - Analytics tracking (impressions + clicks)
 * - Fixed layout (no CLS)
 * - Error handling with retry
 * - Network-aware rotation (disabled on slow 2G/3G)
 * - SSR-safe with hydration fix
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
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const impressionTracked = useRef(false);

  // Get banners for current platform and position
  const banners = bannerConfig[platform][position];
  const currentBanner = banners[currentIndex];

  // SSR/Hydration fix: Only render on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detect slow connection using Network Information API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (connection) {
      const checkConnection = () => {
        // Disable rotation on slow 2G/3G
        const effectiveType = connection.effectiveType;
        setIsSlowConnection(effectiveType === 'slow-2g' || effectiveType === '2g');
      };

      checkConnection();
      connection.addEventListener('change', checkConnection);

      return () => connection.removeEventListener('change', checkConnection);
    }
  }, []);

  // Rotation effect (disabled on slow connections)
  useEffect(() => {
    if (isSlowConnection) return; // Don't rotate on slow connections

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
      setIsLoading(true); // Show loading for next banner
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [banners.length, rotationInterval, isSlowConnection]);

  // Track impression (analytics)
  useEffect(() => {
    if (!isMounted || impressionTracked.current || isBlocked) return;

    // Track banner impression
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'banner_impression', {
        banner_position: position,
        banner_platform: platform,
        banner_index: currentIndex,
        banner_src: currentBanner.src,
      });
    }

    // Track to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Banner Analytics] Impression:', {
        position,
        platform,
        index: currentIndex,
        src: currentBanner.src,
      });
    }

    impressionTracked.current = true;
  }, [isMounted, currentBanner, platform, position, currentIndex, isBlocked]);

  // Handle banner click (analytics)
  const handleBannerClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'banner_click', {
        banner_position: position,
        banner_platform: platform,
        banner_index: currentIndex,
        banner_src: currentBanner.src,
      });
    }

    // Track to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Banner Analytics] Click:', {
        position,
        platform,
        index: currentIndex,
        src: currentBanner.src,
      });
    }
  };

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setRetryCount(0);
  };

  // Handle image load error (ad blocker or network failure)
  const handleImageError = () => {
    // Detect if it's ad blocker (quick failure) vs network issue
    if (retryCount === 0) {
      // First failure might be ad blocker
      setIsBlocked(true);
      setIsLoading(false);
    } else {
      // Subsequent failures are network issues
      setHasError(true);
      setIsLoading(false);
    }

    // Retry logic (up to 3 attempts)
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (imgRef.current) {
          imgRef.current.src = currentBanner.src; // Force reload
        }
      }, 2000 * (retryCount + 1)); // Exponential backoff
    }
  };

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

  // Loading skeleton component
  const LoadingSkeleton = ({ height }: { height: number }) => (
    <div
      className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
      style={{ height: `${height}px`, width: '100%' }}
    >
      <div className="h-full flex items-center justify-center text-xs text-gray-400">
        Loading...
      </div>
    </div>
  );

  // Error/Retry component
  const ErrorState = () => (
    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <p className="text-xs text-red-600 dark:text-red-400 mb-2">Failed to load banner</p>
      <button
        onClick={() => {
          setHasError(false);
          setRetryCount(0);
          setIsLoading(true);
        }}
        className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Retry
      </button>
    </div>
  );

  // Don't render if blocked by ad blocker (hide completely)
  if (isBlocked) {
    return null;
  }

  // Don't render until client-side (SSR fix)
  if (!isMounted) {
    return null;
  }

  // Position-specific layout
  const renderBanner = () => {
    if (position === 'footer') {
      return (
        <div className={`${getContainerStyles()} ${className}`} suppressHydrationWarning>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Fixed height container to prevent CLS */}
            <div className="flex flex-col items-center gap-2 md:gap-4" style={{ minHeight: '280px' }}>
              {/* Sponsored Label */}
              <p className="text-[10px] md:text-xs text-secondary/60 dark:text-accent/60 uppercase tracking-wider">
                Sponsored
              </p>

              {/* Banner Container - Fixed height prevents layout shift */}
              <div className="relative flex items-center justify-center" style={{ minHeight: '250px', width: '100%' }}>
                {isLoading && <LoadingSkeleton height={250} />}
                {hasError && <ErrorState />}

                {!hasError && (
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block hover:opacity-90 transition-opacity duration-200"
                    onClick={handleBannerClick}
                  >
                    <img
                      ref={imgRef}
                      src={currentBanner.src}
                      width={currentBanner.width}
                      height={currentBanner.height}
                      alt={currentBanner.alt}
                      className={`rounded-lg shadow-lg w-full max-w-[970px] h-auto ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </a>
                )}
              </div>

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
        <div className={`${getContainerStyles()} ${className}`} suppressHydrationWarning>
          {/* Header */}
          <div className="text-center mb-2 md:mb-4">
            <p className="text-xs md:text-sm font-semibold text-secondary dark:text-accent mb-1">
              Sponsored
            </p>
            <h3 className="text-sm md:text-lg font-bold text-primary-500">
              Trade with Exness
            </h3>
          </div>

          {/* Banner Container - Fixed height prevents layout shift */}
          <div className="flex justify-center relative" style={{ minHeight: '600px' }}>
            {isLoading && <LoadingSkeleton height={600} />}
            {hasError && <ErrorState />}

            {!hasError && (
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block hover:opacity-90 transition-opacity duration-200"
                onClick={handleBannerClick}
              >
                <img
                  ref={imgRef}
                  src={currentBanner.src}
                  width={currentBanner.width}
                  height={currentBanner.height}
                  alt={currentBanner.alt}
                  className={`rounded-lg shadow-md w-auto h-auto max-w-full max-h-[600px] ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
              </a>
            )}
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
      // Don't show vertical banners (aspect ratio > 1.5) in between-signals on mobile
      const isVerticalBanner = currentBanner.height / currentBanner.width > 1.5;

      // Hide vertical banners on mobile for better UX
      if (platform === 'mobile' && isVerticalBanner) {
        return null;
      }

      return (
        <div className={`${getContainerStyles()} ${className}`} suppressHydrationWarning>
          <div className="flex flex-col items-center gap-3">
            {/* Sponsored Label */}
            <p className="text-xs text-secondary/60 dark:text-accent/60 uppercase tracking-wider">
              Sponsored
            </p>

            {/* Banner Container - Responsive for mobile, optimized for horizontal banners */}
            <div className="relative w-full flex items-center justify-center" style={{ minHeight: '250px' }}>
              {isLoading && <LoadingSkeleton height={250} />}
              {hasError && <ErrorState />}

              {!hasError && (
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="block hover:opacity-90 transition-opacity duration-200 w-full"
                  onClick={handleBannerClick}
                >
                  <img
                    ref={imgRef}
                    src={currentBanner.src}
                    width={currentBanner.width}
                    height={currentBanner.height}
                    alt={currentBanner.alt}
                    // Mobile: max 300px width, horizontal only. Desktop: larger banners allowed
                    className={`rounded-lg shadow-lg w-full h-auto ${
                      platform === 'mobile'
                        ? 'max-w-[300px] max-h-[250px] object-contain mx-auto'
                        : 'max-w-[800px] mx-auto'
                    } ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                  />
                </a>
              )}
            </div>

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
