import { Inter_Tight, Noto_Nastaliq_Urdu } from 'next/font/google';

// Next.js 15 Font Loader - use className for direct font application
// Using 'optional' display to prevent FOIT (Flash of Invisible Text)
// This ensures text is always visible, using fallback font if custom font isn't loaded yet
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-interTight',
  display: 'optional', // Changed from 'swap' to prevent invisible text
  weight: ['400', '500', '600', '700', '800', '900'], // Load only commonly used weights
  preload: true, // Preload the font for faster initial render
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
  adjustFontFallback: true, // Automatically adjust fallback font to minimize layout shift
});

// Phase 1: Urdu font for RTL support
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu',
  display: 'optional', // Changed from 'swap' for consistency
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['Jameel Noori Nastaleeq', 'Mehr Nastaliq', 'serif'],
  adjustFontFallback: true,
});

// Export font family names for direct CSS usage
export const fontFamilies = {
  interTight: '"Inter Tight", sans-serif',
  urdu: '"__Noto_Nastaliq_Urdu_80fcae", "__Noto_Nastaliq_Urdu_Fallback_80fcae", serif',
};

export { interTight, notoNastaliqUrdu };
