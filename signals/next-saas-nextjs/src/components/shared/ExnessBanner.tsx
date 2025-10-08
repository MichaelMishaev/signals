'use client';

const sideBanners = [
  {
    src: 'https://d3dpet1g0ty5ed.cloudfront.net/UR_The_best_pricing_on_gold_120x600_GOOGLE.png',
    width: 120,
    height: 600,
    alt: 'Trade with Exness - Best Pricing on Gold',
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
];

export default function ExnessBanner() {
  // STEP 7: Show static banner (no rotation) to reduce visual clutter
  const currentBanner = sideBanners[0]; // Always show first banner

  return (
    // Banner inside sticky sidebar - no need for sticky positioning
    <div className="bg-background-3 dark:bg-background-7 rounded-xl p-2 md:p-4 shadow-lg">
      {/* Header */}
      <div className="text-center mb-2 md:mb-4">
        <p className="text-xs md:text-sm font-semibold text-secondary dark:text-accent mb-1">
          Sponsored
        </p>
        <h3 className="text-sm md:text-lg font-bold text-primary-500">
          Trade with Exness
        </h3>
      </div>

      {/* Banner Container - Rotating banners responsive */}
      <div className="flex justify-center">
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
