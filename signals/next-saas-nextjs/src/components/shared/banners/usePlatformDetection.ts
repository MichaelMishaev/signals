'use client';

import { useState, useEffect } from 'react';
import { Platform } from './types';

/**
 * Custom hook to detect platform (web/mobile) based on viewport width
 * Uses lg breakpoint (1024px) as threshold
 * Handles SSR gracefully by defaulting to 'web'
 */
export const usePlatformDetection = (): Platform => {
  const [platform, setPlatform] = useState<Platform>('web');

  useEffect(() => {
    // Check viewport width and set platform
    const checkPlatform = () => {
      // lg breakpoint in Tailwind is 1024px
      const isMobile = window.innerWidth < 1024;
      setPlatform(isMobile ? 'mobile' : 'web');
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
