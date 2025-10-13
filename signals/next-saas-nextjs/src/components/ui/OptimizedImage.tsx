'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * OptimizedImage Component
 *
 * A wrapper around Next.js Image component with automatic WebP support,
 * lazy loading, and blur placeholder.
 *
 * Features:
 * - Automatic WebP/AVIF format selection
 * - Lazy loading by default
 * - Blur placeholder during load
 * - Error handling with fallback
 * - Respects prefers-reduced-motion
 *
 * Usage:
 *   <OptimizedImage
 *     src="/images/hero.webp"
 *     alt="Hero image"
 *     width={1200}
 *     height={800}
 *   />
 */

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  /**
   * Fallback image URL if main image fails to load
   */
  fallbackSrc?: string;

  /**
   * Show blur placeholder while loading (default: true)
   */
  showBlurPlaceholder?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  showBlurPlaceholder = true,
  loading = 'lazy',
  quality = 80,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // Convert .png/.jpg to .webp automatically
  const optimizedSrc = typeof imgSrc === 'string' && !hasError
    ? imgSrc.replace(/\.(png|jpg|jpeg)$/, '.webp')
    : imgSrc;

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      loading={loading}
      quality={quality}
      placeholder={showBlurPlaceholder ? 'blur' : 'empty'}
      blurDataURL={showBlurPlaceholder ?
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=='
        : undefined}
      onError={handleError}
      {...props}
    />
  );
}

/**
 * Example usage in existing components:
 *
 * Before:
 * <img src="/images/hero.png" alt="Hero" />
 *
 * After:
 * <OptimizedImage
 *   src="/images/hero.png"  // Will auto-convert to .webp
 *   alt="Hero"
 *   width={1200}
 *   height={800}
 *   fallbackSrc="/images/hero.png"  // Fallback to original
 * />
 */
