'use client';

import { useState, useEffect } from 'react';
import { Platform } from './types';

/**
 * Detect if device is mobile based on User Agent
 * More reliable than viewport width alone
 */
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android',
    'webos',
    'iphone',
    'ipad',
    'ipod',
    'blackberry',
    'windows phone',
    'mobile'
  ];

  return mobileKeywords.some(keyword => userAgent.includes(keyword));
};

/**
 * Custom hook to detect platform (web/mobile)
 * Uses User Agent detection + viewport width for accuracy
 * Handles SSR gracefully by defaulting to 'web'
 *
 * Detection logic:
 * 1. Mobile device (User Agent) → 'mobile'
 * 2. Tablet (User Agent iPad/Android tablet + large screen) → 'web'
 * 3. Desktop browser resized small → 'web'
 * 4. Viewport < 768px AND not desktop → 'mobile'
 */
export const usePlatformDetection = (): Platform => {
  const [platform, setPlatform] = useState<Platform>('web');

  useEffect(() => {
    const checkPlatform = () => {
      // Primary: Check User Agent for mobile devices
      const isMobile = isMobileDevice();
      const viewportWidth = window.innerWidth;

      // Special handling for tablets (iPad, Android tablets)
      const isTablet = /ipad|android(?!.*mobile)/i.test(window.navigator.userAgent.toLowerCase());

      // Decision logic:
      // - Tablets with large screens (>768px) → 'web' banners
      // - Mobile devices → 'mobile' banners
      // - Desktop browsers (even if resized) → 'web' banners
      if (isTablet && viewportWidth >= 768) {
        setPlatform('web');
      } else if (isMobile && viewportWidth < 768) {
        setPlatform('mobile');
      } else if (isMobile) {
        setPlatform('mobile');
      } else {
        setPlatform('web');
      }
    };

    // Initial check
    checkPlatform();

    // Add resize listener for responsive behavior
    window.addEventListener('resize', checkPlatform);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkPlatform);
    };
  }, []);

  return platform;
};
