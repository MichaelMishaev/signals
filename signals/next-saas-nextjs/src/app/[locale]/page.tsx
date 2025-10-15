import Hero from '@/components/tradesignal/Hero';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarTwo from '@/components/shared/header/NavbarTwo';
import ContentTabsSwitcher from '@/components/layout/ContentTabsSwitcher';
import AdBanner from '@/components/shared/banners/AdBanner';
import { fetchAggregatedNews } from '@/utils/fetchNews';
import { Metadata, Viewport } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  title: 'TradeSignal PK - Professional Trading Signals for Pakistan',
  description:
    'Get accurate buy/sell signals with entry, stop-loss, and take-profit levels. Trusted by Pakistani traders.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const TradeSignalHomepage = async ({ params }: { params: { locale: string } }) => {
  // Fetch aggregated news from multiple APIs with locale for translation
  const newsArticles = await fetchAggregatedNews(undefined, undefined, params.locale);

  return (
    <Fragment>
      <NavbarTwo
        className="bg-accent/10 dark:bg-background-7/40 backdrop-blur-[25px] max-md:!top-8"
        btnClassName="btn-green hover:btn-white dark:hover:btn-white-dark"
        hideMenu={true}
        hideLangSwitch={true}
        hideLogo={true}
      />
      <main className="bg-background-2 dark:bg-background-6 relative">
        <Hero />

        {/* Content Tabs Switcher - Toggle between Signals and News */}
        <ContentTabsSwitcher newsArticles={newsArticles} />

        {/* Footer Banner - Above footer - Auto-detects platform */}
        <AdBanner position="footer" />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default TradeSignalHomepage;
