'use client';

import { useEffect, useRef, useState, VideoHTMLAttributes } from 'react';

/**
 * LazyVideo Component
 *
 * Lazy loads videos only when they enter the viewport using Intersection Observer.
 * Respects user's connection speed and motion preferences.
 *
 * Features:
 * - Only loads video when visible (saves bandwidth)
 * - Connection-aware loading (skip on slow connections)
 * - Respects prefers-reduced-motion
 * - Automatic cleanup on unmount
 * - Poster image while loading
 *
 * Usage:
 *   <LazyVideo
 *     src="/video/hero.mp4"
 *     poster="/images/video-poster.webp"
 *     autoPlay
 *     loop
 *     muted
 *   />
 */

interface LazyVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /**
   * Video source URL
   */
  src: string;

  /**
   * Poster image to show before video loads
   */
  poster?: string;

  /**
   * Skip loading on slow connections (default: true)
   */
  skipOnSlowConnection?: boolean;

  /**
   * Respect user's reduced motion preference (default: true)
   */
  respectReducedMotion?: boolean;

  /**
   * Root margin for Intersection Observer (default: '200px')
   */
  rootMargin?: string;
}

export default function LazyVideo({
  src,
  poster,
  skipOnSlowConnection = true,
  respectReducedMotion = true,
  rootMargin = '200px',
  className = '',
  ...videoProps
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check user preferences
    const prefersReducedMotion =
      respectReducedMotion &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Don't load video if user prefers reduced motion
      console.log('⏭️ Skipping video load - user prefers reduced motion');
      return;
    }

    // Check connection speed
    if (skipOnSlowConnection && 'connection' in navigator) {
      const conn = (navigator as any).connection;
      const effectiveType = conn?.effectiveType;

      // Skip on slow connections (2g, slow-2g)
      if (effectiveType === '2g' || effectiveType === 'slow-2g') {
        console.log('⏭️ Skipping video load - slow connection detected');
        return;
      }
    }

    // Setup Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin,
        threshold: 0.1,
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [skipOnSlowConnection, respectReducedMotion, rootMargin]);

  // Load video source when it becomes visible
  useEffect(() => {
    if (shouldLoad && videoRef.current && !videoRef.current.src) {
      videoRef.current.src = src;
      videoRef.current.load();
    }
  }, [shouldLoad, src]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={className}
      preload={shouldLoad ? 'auto' : 'none'}
      {...videoProps}
    >
      {/* Source tag as fallback */}
      {shouldLoad && <source src={src} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
}

/**
 * Example usage in existing components:
 *
 * Before:
 * <video src="/video/hero.mp4" autoPlay loop muted />
 *
 * After:
 * <LazyVideo
 *   src="/video/hero.mp4"
 *   poster="/images/hero-poster.webp"
 *   autoPlay
 *   loop
 *   muted
 *   skipOnSlowConnection={true}
 *   respectReducedMotion={true}
 * />
 */
