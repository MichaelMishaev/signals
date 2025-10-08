'use client';

import RevealAnimation from '../animation/RevealAnimation';
import GeneralTab from './GeneralTab';
import { useSafeTranslations, useSafeLocale } from '@/hooks/useSafeTranslations';
import Link from 'next/link';

const FaqTab = () => {
  const t = useSafeTranslations('faq');
  const tCommon = useSafeTranslations('common');
  const locale = useSafeLocale();

  return (
    <section className="py-[100px]">
      <div className="main-container">
        {/* Home Button */}
        <RevealAnimation delay={0.1}>
          <div className="mb-8">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {tCommon('backToHome')}
            </Link>
          </div>
        </RevealAnimation>

        <div className="text-center space-y-5">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-cyan">{t('pageTitle')}</span>
          </RevealAnimation>
          <div className="space-y-3 text-center">
            <RevealAnimation delay={0.3}>
              <h2>{t('pageHeading')}</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="max-w-[600px] mx-auto">
                {t('meta.description')}
              </p>
            </RevealAnimation>
          </div>
        </div>
        <RevealAnimation delay={0.5}>
          <div className="py-[70px]">
            <GeneralTab />
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default FaqTab;
