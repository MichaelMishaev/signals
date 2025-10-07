'use client';

import { useState, useEffect } from 'react';

const footerBanners = [
  {
    src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_The_best_pricing_on_gold_728x90_GOOGLE.png',
    width: 728,
    height: 90,
    alt: 'Exness - The Best Pricing on Gold',
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
];

export default function ExnessFooterBanner() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % footerBanners.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentBanner = footerBanners[currentBannerIndex];

  return (
    // Always visible on all screen sizes
    <div className="bg-background-3 dark:bg-background-7 py-4 md:py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 md:gap-4">
          {/* Sponsored Label */}
          <p className="text-[10px] md:text-xs text-secondary/60 dark:text-accent/60 uppercase tracking-wider">
            Sponsored
          </p>

          {/* Banner - Rotating banners responsive */}
          <a
            href="https://one.exnessonelink.com/intl/en/a/c_8f0nxidtbt"
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
