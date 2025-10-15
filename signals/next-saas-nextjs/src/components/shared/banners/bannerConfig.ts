import { BannerConfig } from './types';

/**
 * Complete banner configuration for Exness advertising
 * Organized by platform (web/mobile) and position (side/footer/between-signals)
 * Each position has 3 rotating variants
 */
export const bannerConfig: BannerConfig = {
  web: {
    // Side banner variants (sticky sidebar)
    side: [
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_The_best_pricing_on_gold_120x600_GOOGLE.png',
        width: 120,
        height: 600,
        alt: 'Exness - Best Pricing on Gold',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_Take_control_160x600.png',
        width: 160,
        height: 600,
        alt: 'Take Control with Exness',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_625k_traders_choose_Exness_120x600.png',
        width: 120,
        height: 600,
        alt: '625k Traders Choose Exness',
      },
    ],

    // Footer banner variants (above risk disclaimer)
    footer: [
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_The_best_pricing_on_gold_728x90_GOOGLE.png',
        width: 728,
        height: 90,
        alt: 'Exness - Best Pricing on Gold',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_Take_control_320x50.png',
        width: 320,
        height: 50,
        alt: 'Take Control with Exness',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_625k_traders_choose_Exness_970x250.png',
        width: 970,
        height: 250,
        alt: '625k Traders Choose Exness',
      },
    ],

    // Between signals banner variants (inline in content)
    'between-signals': [
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_The_best_pricing_on_gold_800x800_GOOGLE.png',
        width: 800,
        height: 800,
        alt: 'Exness - Best Pricing on Gold',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_Take_control_300x250.png',
        width: 300,
        height: 250,
        alt: 'Take Control with Exness',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_625k_traders_choose_Exness_300x250.png',
        width: 300,
        height: 250,
        alt: '625k Traders Choose Exness',
      },
    ],
  },

  mobile: {
    // Side banner variants (sticky sidebar) - ONLY for actual sidebars
    // These should NEVER appear in content areas on mobile
    side: [
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_The_best_pricing_on_gold_120x600_GOOGLE.png',
        width: 120,
        height: 600,
        alt: 'Exness - Best Pricing on Gold',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_Take_control_120x600.png',
        width: 120,
        height: 600,
        alt: 'Take Control with Exness',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_625k_traders_choose_Exness_120x600.png',
        width: 120,
        height: 600,
        alt: '625k Traders Choose Exness',
      },
    ],

    // Footer banner variants (above risk disclaimer) - Horizontal only
    footer: [
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_The_best_pricing_on_gold_720x90_GOOGLE.png',
        width: 720,
        height: 90,
        alt: 'Exness - Best Pricing on Gold',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_Take_control_728x90.png',
        width: 728,
        height: 90,
        alt: 'Take Control with Exness',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_625k_traders_choose_Exness_720x90.png',
        width: 720,
        height: 90,
        alt: '625k Traders Choose Exness',
      },
    ],

    // Between signals banner variants (inline in content)
    // CRITICAL: ONLY compact horizontal banners (300x250 max) for good mobile UX
    // NO vertical banners allowed here - they break mobile layout
    'between-signals': [
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_The_best_pricing_on_gold_300x250_GOOGLE.png',
        width: 300,
        height: 250,
        alt: 'Exness - Best Pricing on Gold',
      },
      {
        src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_625k_traders_choose_Exness_300x250.png',
        width: 300,
        height: 250,
        alt: '625k Traders Choose Exness',
      },
    ],
  },
};

/**
 * Get affiliate URL with proper tracking parameters
 */
export const getAffiliateUrl = (platform: 'web' | 'mobile', position: string): string => {
  const baseUrl = 'https://one.exnessonelink.com/intl/en/a/c_8f0nxidtbt';

  if (platform === 'mobile') {
    return `${baseUrl}?platform=mobile&pos=${position}`;
  }

  return `${baseUrl}?pos=${position}`;
};
