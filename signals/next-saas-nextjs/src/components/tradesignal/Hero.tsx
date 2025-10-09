'use client';

import { CheckIcon } from '@/icons';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';
import { useState } from 'react';
import SignalSummaryModal from './SignalSummaryModal';

const Hero = () => {
  const t = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [urduRequestSent, setUrduRequestSent] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|ur)/, '');
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`;
    router.push(newPath);
  };

  const handleUrduInterest = async () => {
    try {
      // Track interest in Urdu translation
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'urdu_interest_clicked',
          timestamp: new Date().toISOString(),
          page_path: window.location.pathname
        })
      });

      setUrduRequestSent(true);

      // Show feedback message
      alert('شکریہ! Thank you for your interest!\n\nWe\'re evaluating Urdu language support. Your feedback helps us prioritize features.');

      // Reset after 5 seconds
      setTimeout(() => setUrduRequestSent(false), 5000);
    } catch (error) {
      console.error('Failed to track Urdu interest:', error);
      // Still show message even if tracking fails
      alert('شکریہ! Thank you for your interest!');
    }
  };

  const scrollToLastSignal = (e: React.MouseEvent) => {
    e.preventDefault();
    // Try to find the last signal card in the signals feed
    const signalCards = document.querySelectorAll('[data-signal-card]');
    const lastSignal = signalCards[signalCards.length - 1];

    if (lastSignal) {
      lastSignal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback: scroll to timeline section if no signals found
      const timelineElement = document.querySelector('.bg-background-3.dark\\:bg-background-7');
      if (timelineElement) {
        timelineElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="md:mt-4 lg:mt-6 xl:mt-[30px]">
      <div className="max-w-[1860px] mx-auto pt-[170px] sm:pt-[190px] md:pt-[210px] lg:pt-[220px] pb-[80px] sm:pb-[100px] lg:pb-[200px] min-h-[600px] md:max-h-[940px] md:rounded-[30px] xl:rounded-[50px] relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 dark:from-primary-700 dark:via-primary-600 dark:to-primary-500">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Live Market Ticker */}
        <div className="absolute top-4 left-0 right-0 z-10">
          <div className="bg-black/30 backdrop-blur-sm text-white py-2 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="mx-4">🔴 USD/PKR: 285.50 (-0.25%)</span>
              <span className="mx-4">🟢 PSX: 45,250 (+1.2%)</span>
              <span className="mx-4">🟢 Gold: $1,950 (+0.8%)</span>
              <span className="mx-4">🔴 BTC: $42,500 (-2.1%)</span>
              <span className="mx-4">🟢 EUR/PKR: 310.25 (+0.5%)</span>
            </div>
          </div>
        </div>

        <div className="main-container relative z-10">
          <div className="space-y-3 md:space-y-5 text-center md:text-left max-w-full md:max-w-[800px]">
            <RevealAnimation delay={0.1}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="inline-block text-xs sm:text-tagline-2 font-medium backdrop-blur-[18px] rounded-full px-3 sm:px-5 py-1.5 bg-ns-yellow/20 text-ns-yellow-light badge-yellow-v2">
                  {t('badge')}
                </span>

                {/* Language Pills - Enhanced Visibility */}
                <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                      locale === 'en'
                        ? 'bg-white text-primary-600 shadow-lg scale-105'
                        : 'bg-transparent text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => switchLanguage('ur')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                      locale === 'ur'
                        ? 'bg-white text-primary-600 shadow-lg scale-105'
                        : 'bg-transparent text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    🇵🇰 اردو
                  </button>
                </div>
              </div>
            </RevealAnimation>
            <div className="space-y-2.5 md:space-y-4">
              <RevealAnimation delay={0.2}>
                <h1 className="max-w-full md:max-w-[800px] leading-[1.2] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  <span className="text-white block">{t('title.line1')}</span>
                  <span className="text-ns-yellow block mt-2">{t('title.line2')}</span>
                </h1>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <p className="text-white/90 max-w-full md:max-w-[600px] text-sm sm:text-base px-4 md:px-0">
                  {t('description')}
                </p>
              </RevealAnimation>
              <ul className="flex flex-col flex-wrap sm:flex-row items-center sm:items-start md:items-center gap-y-3 gap-x-4 sm:gap-x-9 mt-8 md:mt-[54px] px-4 md:px-0">
                <RevealAnimation delay={0.4}>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-ns-green/30">
                      <CheckIcon className="fill-white" />
                    </span>
                    <span className="text-white/90 text-xs sm:text-tagline-2">{t('features.realtime')}</span>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.5}>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-ns-green/30">
                      <CheckIcon className="fill-white" />
                    </span>
                    <span className="text-white/90 text-xs sm:text-tagline-2">{t('features.psxForex')}</span>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.6}>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-ns-green/30">
                      <CheckIcon className="fill-white" />
                    </span>
                    <span className="text-white/90 text-xs sm:text-tagline-2">{t('features.riskManagement')}</span>
                  </li>
                </RevealAnimation>
              </ul>
            </div>
          </div>
          <ul className="flex flex-col sm:flex-row items-center sm:items-start gap-y-4 gap-x-4 justify-center sm:justify-start mt-12 md:mt-14 lg:mb-[100px] px-4 sm:px-0">
            <RevealAnimation delay={0.7} direction="left" offset={50}>
              <li className="w-full sm:w-auto relative">
                {/* HOT Badge */}
                <span className="absolute -top-3 -right-2 z-10 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
                  🔥 HOT
                </span>
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="btn btn-primary hover:btn-white dark:hover:btn-white-dark mx-auto sm:mx-0 block md:inline-block w-[90%] md:w-auto btn-lg md:btn-xl border-0 font-bold">
                  {t('cta.startTrial')}
                </button>
              </li>
            </RevealAnimation>
            <RevealAnimation delay={0.9} direction="left" offset={50}>
              <li className="w-full sm:w-auto">
                <button
                  onClick={scrollToLastSignal}
                  className="btn btn-lg md:btn-xl btn-dark bg-white/20 backdrop-blur-sm mx-auto sm:mx-0 block md:inline-block w-[90%] md:w-auto hover:bg-white/30 text-white border-white/30">
                  {t('cta.viewLiveSignals')}
                </button>
              </li>
            </RevealAnimation>
          </ul>

          {/* Phase 0: Urdu Interest Tracker - Only show on English pages */}
          {locale === 'en' && (
            <RevealAnimation delay={1.1}>
              <div className="mt-6 px-4 sm:px-0">
                <button
                  onClick={handleUrduInterest}
                  disabled={urduRequestSent}
                  className={`text-sm flex items-center gap-2 ${
                    urduRequestSent
                      ? 'text-white/50 cursor-not-allowed'
                      : 'text-white/90 hover:text-white hover:underline cursor-pointer'
                  } transition-colors`}
                  aria-label="Request Urdu language support"
                >
                  <span className="text-lg">🇵🇰</span>
                  <span className="font-medium">
                    {urduRequestSent ? '✓ شکریہ Thanks!' : 'اردو میں دیکھیں؟ (View in Urdu?)'}
                  </span>
                </button>
              </div>
            </RevealAnimation>
          )}

          {/* Live Signal Notification */}
          <RevealAnimation delay={1.0}>
            <div className={`mt-8 md:mt-0 md:absolute md:bottom-10 ${locale === 'ur' ? 'md:left-10' : 'md:right-10'} bg-white/95 dark:bg-black/80 backdrop-blur-md rounded-xl p-4 max-w-sm mx-auto md:mx-0 shadow-2xl animate-pulse-soft ${locale === 'ur' ? 'text-right' : 'text-left'}`} dir={locale === 'ur' ? 'rtl' : 'ltr'}>
              <div className={`flex items-center gap-3 mb-2 ${locale === 'ur' ? 'flex-row-reverse' : ''}`}>
                <span className="inline-flex size-3 bg-ns-green rounded-full animate-ping"></span>
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {t('liveNotification.title')}
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 dark:text-white">{t('liveNotification.signalExample')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t('liveNotification.details')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('liveNotification.metadata')}</p>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>

      {/* Signal Summary Modal */}
      <SignalSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
      />
    </section>
  );
};

export default Hero;
