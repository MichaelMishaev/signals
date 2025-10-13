'use client';

import { CheckIcon } from '@/icons';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';
import { useState } from 'react';
import SignalSummaryModal from './SignalSummaryModal';
import Toast from '../shared/Toast';

const Hero = () => {
  const t = useTranslations('hero');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [urduRequestSent, setUrduRequestSent] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

      // Show toast notification instead of alert
      setToastMessage('شکریہ! Thank you for your interest!\n\nWe\'re evaluating Urdu language support. Your feedback helps us prioritize features.');
      setShowToast(true);

      // Reset after 5 seconds
      setTimeout(() => setUrduRequestSent(false), 5000);
    } catch (error) {
      console.error('Failed to track Urdu interest:', error);
      // Still show message even if tracking fails
      setToastMessage('شکریہ! Thank you for your interest!');
      setShowToast(true);
    }
  };

  const scrollToSignals = (e: React.MouseEvent) => {
    e.preventDefault();

    const findAndScrollToFirstSignal = () => {
      console.log('🔍 Attempting to scroll to first signal...');

      // Priority 1: Try to find signal cards by data attribute
      const signalCards = document.querySelectorAll('[data-signal-card]');
      console.log(`📊 Found ${signalCards.length} signal cards`);

      if (signalCards.length > 0) {
        console.log('✅ Scrolling to first signal card (index 0)');
        signalCards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        return true;
      }

      // Priority 2: Try to find signals feed container by ID
      const signalsFeedById = document.getElementById('signals-feed-container');
      if (signalsFeedById) {
        console.log('✅ Scrolling to signals feed container (by ID)');
        signalsFeedById.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }

      // Priority 3: Try timeline section
      const timelineElement = document.querySelector('section.bg-background-3, section.dark\\:bg-background-7');
      if (timelineElement) {
        console.log('✅ Scrolling to timeline section (fallback)');
        timelineElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }

      console.log('❌ Could not find any scroll target');
      return false;
    };

    // Try immediately
    const success = findAndScrollToFirstSignal();

    // If fails, retry after short delay for DOM to render
    if (!success) {
      console.log('⏳ Retrying in 200ms...');
      setTimeout(() => {
        findAndScrollToFirstSignal();
      }, 200);
    }
  };

  return (
    <section className="md:mt-4 lg:mt-6 xl:mt-[30px]">
      <div className="max-w-[1860px] mx-auto pt-[100px] sm:pt-[130px] md:pt-[160px] lg:pt-[180px] pb-[60px] sm:pb-[80px] lg:pb-[150px] min-h-[600px] md:max-h-[940px] md:rounded-3xl xl:rounded-[40px] relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 dark:from-primary-600 dark:via-primary-500 dark:to-primary-400">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="main-container relative z-10">
          <div className="space-y-3 md:space-y-5 text-center md:text-left max-w-full md:max-w-[800px]">
            <RevealAnimation delay={0.1}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="inline-block text-xs sm:text-tagline-2 font-medium backdrop-blur-[18px] rounded-full px-3 sm:px-5 py-1.5 bg-ns-yellow/20 text-ns-yellow-light badge-yellow-v2">
                  {t('badge')}
                </span>

                {/* Language Pills - Enhanced Visibility */}
                <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20" role="group" aria-label="Language selector">
                  <button
                    onClick={() => switchLanguage('en')}
                    aria-label={locale === 'en' ? 'English - Current language' : 'Switch to English'}
                    aria-current={locale === 'en' ? 'true' : 'false'}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                      locale === 'en'
                        ? 'bg-white text-primary-600 shadow-lg scale-105'
                        : 'bg-transparent text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    <span aria-hidden="true">🇬🇧</span> <span lang="en">English</span>
                  </button>
                  <button
                    onClick={() => switchLanguage('ur')}
                    aria-label={locale === 'ur' ? 'اردو - موجودہ زبان' : 'اردو میں تبدیل کریں'}
                    aria-current={locale === 'ur' ? 'true' : 'false'}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                      locale === 'ur'
                        ? 'bg-white text-primary-600 shadow-lg scale-105'
                        : 'bg-transparent text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    <span aria-hidden="true">🇵🇰</span> <span lang="ur">اردو</span>
                  </button>
                </div>
              </div>
            </RevealAnimation>
            <div className="space-y-2.5 md:space-y-4">
              <RevealAnimation delay={0.2}>
                <h1 className="max-w-full md:max-w-[800px] leading-[1.15] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  <span className="text-white block">{t('title.line1')}</span>
                  <span className="text-ns-yellow block mt-1.5 sm:mt-2">{t('title.line2')}</span>
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
                {/* Free Trial Badge */}
                <span className="absolute -top-3 -right-2 z-10 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                  ✓ 7-Day Free Trial
                </span>
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="btn btn-primary hover:btn-white dark:hover:btn-white-dark mx-auto sm:mx-0 block md:inline-block w-[90%] md:w-auto btn-lg md:btn-xl border-0 font-bold">
                  {t('cta.startTrial')}
                </button>
              </li>
            </RevealAnimation>
            <RevealAnimation delay={0.8} direction="left" offset={50}>
              <li className="w-full sm:w-auto">
                <button
                  onClick={scrollToSignals}
                  className="btn btn-lg md:btn-xl btn-dark bg-white/20 backdrop-blur-sm mx-auto sm:mx-0 block md:inline-block w-[90%] md:w-auto hover:bg-white/30 text-white border-white/30">
                  {t('cta.viewLiveSignals')}
                </button>
              </li>
            </RevealAnimation>
          </ul>

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

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
          duration={6000}
        />
      )}
    </section>
  );
};

export default Hero;
