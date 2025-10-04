import Hero from '@/components/tradesignal/Hero';
import RiskDisclaimer from '@/components/tradesignal/RiskDisclaimer';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarTwo from '@/components/shared/header/NavbarTwo';
import ReviewsV1 from '@/components/shared/reviews/ReviewsV1';
import TimelineSidebarLayout from '@/components/layout/TimelineSidebarLayout';
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

const TradeSignalHomepage = () => {
  return (
    <Fragment>
      <NavbarTwo
        className="bg-accent/10 dark:bg-background-7/40 backdrop-blur-[25px] max-md:!top-8"
        btnClassName="btn-green hover:btn-white dark:hover:btn-white-dark"
      />
      <main className="bg-background-2 dark:bg-background-6">
        <Hero />
        <TimelineSidebarLayout />
        <ReviewsV1
          btnClassName="btn btn-secondary btn-lg md:btn-xl dark:btn-transparent hover:btn-green block md:inline-block w-[90%] md:w-auto mx-auto"
          badgeColor="badge-green-v2"
          background="bg-background-4 dark:bg-background-6 pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-20 md:pb-28 lg:pb-36 xl:pb-[200px]"
        />
        <RiskDisclaimer />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default TradeSignalHomepage;
