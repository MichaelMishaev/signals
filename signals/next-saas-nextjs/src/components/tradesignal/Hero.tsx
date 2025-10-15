'use client';

import { CheckIcon } from '@/icons';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';
import { useState, useEffect } from 'react';
import SignalSummaryModal from './SignalSummaryModal';
import Toast from '../shared/Toast';
import { SignalData } from '@/utils/supabase';
import { fetchLivePrices, calculatePnL, formatPrice } from '@/services/livePriceService';

const Hero = () => {
  const t = useTranslations('hero');
  const tSignals = useTranslations('signals.sidebar.labels');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [urduRequestSent, setUrduRequestSent] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Real-time signal data
  const [liveSignal, setLiveSignal] = useState<SignalData | null>(null);
  const [signalLoading, setSignalLoading] = useState(true);
  const [livePrice, setLivePrice] = useState<number | null>(null);

  // Fetch latest signal on component mount
  useEffect(() => {
    const fetchLatestSignal = async () => {
      try {
        const response = await fetch(`/api/signals?limit=1&status=ACTIVE&locale=${locale}`);
        const data = await response.json();
        if (data.signals && data.signals.length > 0) {
          setLiveSignal(data.signals[0]);

          // Fetch live price for this signal
          const prices = await fetchLivePrices([data.signals[0].pair]);
          if (prices[data.signals[0].pair]) {
            setLivePrice(prices[data.signals[0].pair].price);
          }
        }
      } catch (error) {
        console.error('Error fetching latest signal:', error);
      } finally {
        setSignalLoading(false);
      }
    };

    fetchLatestSignal();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLatestSignal, 30000);
    return () => clearInterval(interval);
  }, [locale]);

  // Update live price every 10 seconds
  useEffect(() => {
    if (!liveSignal) return;

    const updateLivePrice = async () => {
      try {
        const prices = await fetchLivePrices([liveSignal.pair]);
        if (prices[liveSignal.pair]) {
          setLivePrice(prices[liveSignal.pair].price);
        }
      } catch (error) {
        console.error('Error updating live price:', error);
      }
    };

    const priceInterval = setInterval(updateLivePrice, 10000);
    return () => clearInterval(priceInterval);
  }, [liveSignal]);

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
        {/* Enhanced Background Pattern with Multiple Layers */}
        <div className="absolute inset-0 opacity-[0.08]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Radial Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-green-400/15 to-emerald-500/15 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>

        <div className="main-container relative z-10">
          {/* Top Bar: Trust Indicators + Language Selector */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
            <RevealAnimation delay={0.05}>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
                {/* Trust Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white font-semibold text-sm">95% Win Rate</span>
                </div>

                {/* Social Proof Counter */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
                  <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-white font-semibold text-sm">10,000+ Traders</span>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-md rounded-full border border-green-400/30 shadow-lg">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-white font-semibold text-sm">Live Now</span>
                </div>
              </div>
            </RevealAnimation>

            {/* Language Selector - Improved Positioning */}
            <RevealAnimation delay={0.1}>
              <div className="flex gap-2 p-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/30 shadow-xl" role="group" aria-label="Language selector">
                <button
                  onClick={() => switchLanguage('en')}
                  aria-label={locale === 'en' ? 'English - Current language' : 'Switch to English'}
                  aria-current={locale === 'en' ? 'true' : 'false'}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    locale === 'en'
                      ? 'bg-white text-primary-600 shadow-xl scale-105'
                      : 'bg-transparent text-white hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  <span aria-hidden="true">🇬🇧</span> <span lang="en">English</span>
                </button>
                <button
                  onClick={() => switchLanguage('ur')}
                  aria-label={locale === 'ur' ? 'اردو - موجودہ زبان' : 'اردو میں تبدیل کریں'}
                  aria-current={locale === 'ur' ? 'true' : 'false'}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    locale === 'ur'
                      ? 'bg-white text-primary-600 shadow-xl scale-105'
                      : 'bg-transparent text-white hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  <span aria-hidden="true">🇵🇰</span> <span lang="ur">اردو</span>
                </button>
              </div>
            </RevealAnimation>
          </div>

          {/* Main Content: Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <RevealAnimation delay={0.15}>
                <span className="inline-block text-xs sm:text-sm font-bold backdrop-blur-md rounded-full px-5 py-2.5 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 text-white border border-yellow-400/30 shadow-xl">
                  {t('badge')}
                </span>
              </RevealAnimation>

              {/* Headline with Enhanced Typography */}
              <div className="space-y-3 md:space-y-4">
                <RevealAnimation delay={0.2}>
                  <h1 className="leading-[1.1] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight">
                    <span className="text-white block drop-shadow-2xl">{t('title.line1')}</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 block mt-2 drop-shadow-2xl">{t('title.line2')}</span>
                  </h1>
                </RevealAnimation>

                <RevealAnimation delay={0.3}>
                  <p className="text-white/95 max-w-full lg:max-w-[600px] text-base sm:text-lg md:text-xl leading-relaxed font-medium px-4 lg:px-0 drop-shadow-lg">
                    {t('description')}
                  </p>
                </RevealAnimation>
              </div>

              {/* Feature Pills - Redesigned */}
              <RevealAnimation delay={0.35}>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 px-4 lg:px-0">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/15 backdrop-blur-md rounded-xl border border-white/30 shadow-lg transition-transform hover:scale-105">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                      <CheckIcon className="fill-white w-3 h-3" />
                    </span>
                    <span className="text-white font-semibold text-sm sm:text-base">{t('features.realtime')}</span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 bg-white/15 backdrop-blur-md rounded-xl border border-white/30 shadow-lg transition-transform hover:scale-105">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                      <CheckIcon className="fill-white w-3 h-3" />
                    </span>
                    <span className="text-white font-semibold text-sm sm:text-base">{t('features.psxForex')}</span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 bg-white/15 backdrop-blur-md rounded-xl border border-white/30 shadow-lg transition-transform hover:scale-105">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                      <CheckIcon className="fill-white w-3 h-3" />
                    </span>
                    <span className="text-white font-semibold text-sm sm:text-base">{t('features.riskManagement')}</span>
                  </div>
                </div>
              </RevealAnimation>

              {/* CTA Buttons - Enhanced */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 px-4 lg:px-0">
                <RevealAnimation delay={0.4} direction="left" offset={30}>
                  <div className="w-full sm:w-auto relative group">
                    {/* Animated Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>

                    {/* Free Trial Badge - Redesigned */}
                    <span className="absolute -top-4 -right-3 z-10 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-extrabold rounded-full shadow-2xl border-2 border-white animate-bounce-subtle">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      7-DAY FREE
                    </span>

                    <button
                      onClick={() => setShowSummaryModal(true)}
                      className="relative btn btn-lg md:btn-xl bg-white text-primary-600 hover:bg-white/90 mx-auto sm:mx-0 block w-full sm:w-auto border-0 font-extrabold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(16,185,129,0.5)]">
                      {t('cta.startTrial')}
                      <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </RevealAnimation>

                <RevealAnimation delay={0.45} direction="left" offset={30}>
                  <button
                    onClick={scrollToSignals}
                    className="btn btn-lg md:btn-xl bg-white/15 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/25 hover:border-white/50 mx-auto sm:mx-0 block w-full sm:w-auto font-bold shadow-xl transition-all duration-300 hover:scale-105">
                    {t('cta.viewLiveSignals')}
                    <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </RevealAnimation>
              </div>

              {/* Trust Indicators Below CTAs */}
              <RevealAnimation delay={0.5}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6 px-4 lg:px-0 text-white/80">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-lg"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow-lg"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white shadow-lg"></div>
                    </div>
                    <span className="text-sm font-semibold">Trusted by 10,000+</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold ml-2">4.9/5 Rating</span>
                  </div>
                </div>
              </RevealAnimation>
            </div>

            {/* Right Column: Live Signal Card - Enhanced with Real Data */}
            <div className="lg:col-span-5 px-4 lg:px-0">
              <RevealAnimation delay={0.6}>
                <div className={`relative ${locale === 'ur' ? 'text-right' : 'text-left'}`} dir={locale === 'ur' ? 'rtl' : 'ltr'}>
                  {/* Glow Effect Behind Card */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-green-400/30 to-blue-500/30 rounded-3xl blur-2xl"></div>

                  {/* Signal Card - Compact on mobile */}
                  <div className="relative bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.3)] border border-white/20">
                    {signalLoading ? (
                      /* Loading State */
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading latest signal...</p>
                      </div>
                    ) : liveSignal ? (
                      <>
                        {/* Header - Compact */}
                        <div className={`flex items-center justify-between mb-3 md:mb-5 ${locale === 'ur' ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-2 ${locale === 'ur' ? 'flex-row-reverse' : ''}`}>
                            <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">
                              {t('liveNotification.title')}
                            </span>
                          </div>
                          <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {new Date(liveSignal.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Signal Details - Compact */}
                        <div className="space-y-3 md:space-y-4">
                          <div>
                            <h4 className="font-extrabold text-xl md:text-2xl text-gray-900 dark:text-white">
                              {liveSignal.pair} {liveSignal.action} Signal
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{liveSignal.title}</p>
                          </div>

                          {/* Live Price Badge - Compact */}
                          {livePrice && (
                            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-xl p-2 md:p-3 border-2 border-primary-200 dark:border-primary-700">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] md:text-xs font-semibold text-gray-600 dark:text-gray-400">Current Price</span>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                  <span className="text-base md:text-lg font-extrabold text-primary-600 dark:text-primary-400">
                                    {formatPrice(livePrice, liveSignal.pair)}
                                  </span>
                                  {(() => {
                                    const pnl = calculatePnL(livePrice, liveSignal.entry, liveSignal.action);
                                    return (
                                      <span className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${pnl.isProfit ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                        {pnl.isProfit ? '▲' : '▼'} {Math.abs(pnl.pnlPercent).toFixed(2)}%
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Entry/SL/TP - Better mobile layout */}
                          <div className="grid grid-cols-3 gap-2 md:gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg md:rounded-xl p-2 md:p-3 border border-blue-200 dark:border-blue-800">
                              <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 font-semibold mb-0.5 md:mb-1">{tSignals('entry')}</p>
                              <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {liveSignal.entry.toFixed(liveSignal.pair.includes('JPY') ? 2 : 4)}
                              </p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg md:rounded-xl p-2 md:p-3 border border-red-200 dark:border-red-800">
                              <p className="text-[10px] md:text-xs text-red-600 dark:text-red-400 font-semibold mb-0.5 md:mb-1">{tSignals('stopLoss')}</p>
                              <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {liveSignal.stop_loss.toFixed(liveSignal.pair.includes('JPY') ? 2 : 4)}
                              </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg md:rounded-xl p-2 md:p-3 border border-green-200 dark:border-green-800">
                              <p className="text-[10px] md:text-xs text-green-600 dark:text-green-400 font-semibold mb-0.5 md:mb-1">{tSignals('takeProfit')}</p>
                              <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                {liveSignal.take_profit.toFixed(liveSignal.pair.includes('JPY') ? 2 : 4)}
                              </p>
                            </div>
                          </div>

                          {/* Metadata Pills - Compact */}
                          <div className={`flex flex-wrap gap-1.5 md:gap-2 ${locale === 'ur' ? 'flex-row-reverse' : ''}`}>
                            <span className="px-2 md:px-3 py-1 md:py-1.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] md:text-xs font-bold">
                              Confidence: {liveSignal.confidence}%
                            </span>
                            <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold ${
                              liveSignal.action === 'BUY'
                                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                            }`}>
                              {liveSignal.action}
                            </span>
                            <span className="px-2 md:px-3 py-1 md:py-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-lg text-[10px] md:text-xs font-bold">
                              {liveSignal.market}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* No Signal State */
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No active signals available</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                          Refresh
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </RevealAnimation>
            </div>
          </div>
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
