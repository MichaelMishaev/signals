'use client';

import Link from 'next/link';
import { useSafeTranslations, useSafeLocale } from '@/hooks/useSafeTranslations';
import RevealAnimation from '../animation/RevealAnimation';

const TermsConditionContent = () => {
  const t = useSafeTranslations('terms');
  const tCommon = useSafeTranslations('common');
  const locale = useSafeLocale();

  // List of all section keys from translations
  const sections = [
    'acceptance',
    'serviceDescription',
    'userResponsibilities',
    'riskDisclosure',
    'noFinancialAdvice',
    'accuracy',
    'subscriptionTerms',
    'intellectualProperty',
    'prohibitedUse',
    'dataPrivacy',
    'thirdPartyLinks',
    'limitation',
    'indemnification',
    'termination',
    'governingLaw',
    'secp',
    'modifications',
    'severability',
    'contact',
  ];

  return (
    <section className="pb-14 md:pb-16 lg:pb-[88px] xl:pb-[200px] pt-[100px]">
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

        <RevealAnimation delay={0.2}>
          <div className="space-y-3 mb-8">
            <h1 className="text-4xl font-bold">{t('pageHeading')}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('lastUpdated')}</p>
          </div>
        </RevealAnimation>

        <article className="terms-conditions-body space-y-8">
          {sections.map((sectionKey, index) => {
            const hasPoints = sectionKey === 'userResponsibilities' ||
                             sectionKey === 'subscriptionTerms' ||
                             sectionKey === 'prohibitedUse';

            return (
              <RevealAnimation key={sectionKey} delay={0.1 + index * 0.05}>
                <div className="space-y-4 bg-white dark:bg-background-6 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-secondary dark:text-accent">
                    {t(`sections.${sectionKey}.title`)}
                  </h3>

                  {hasPoints ? (
                    <>
                      <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                        {Array.from({ length: 5 }).map((_, i) => {
                          try {
                            const point = t(`sections.${sectionKey}.points.${i}`);
                            return point ? <li key={i}>{point}</li> : null;
                          } catch {
                            return null;
                          }
                        })}
                      </ul>
                    </>
                  ) : sectionKey === 'contact' ? (
                    <>
                      <p className="text-gray-700 dark:text-gray-300">{t(`sections.${sectionKey}.content`)}</p>
                      <div className="mt-4 space-y-2">
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Email:</strong> {t(`sections.${sectionKey}.email`)}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <strong>Address:</strong> {t(`sections.${sectionKey}.address`)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t(`sections.${sectionKey}.content`)}
                    </p>
                  )}
                </div>
              </RevealAnimation>
            );
          })}

          {/* Acknowledgment */}
          <RevealAnimation delay={0.8}>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-secondary dark:text-accent mb-4">
                {t('acknowledgment.title')}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t('acknowledgment.content')}
              </p>
            </div>
          </RevealAnimation>
        </article>
      </div>
    </section>
  );
};

export default TermsConditionContent;
