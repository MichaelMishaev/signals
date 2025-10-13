'use client';

import RevealAnimation from '@/components/animation/RevealAnimation';
import { cn } from '@/utils/cn';
import behance from '@public/images/icons/behance.svg';
import dribbble from '@public/images/icons/dribbble.svg';
import facebook from '@public/images/icons/facebook.svg';
import instagram from '@public/images/icons/instagram.svg';
import linkedin from '@public/images/icons/linkedin.svg';
import youtube from '@public/images/icons/youtube.svg';
import darkLogo from '@public/images/shared/dark-logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useSafeTranslations, useSafeLocale } from '@/hooks/useSafeTranslations';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';
import FooterDivider from './FooterDivider';
import FooterLeftGradient from './FooterLeftGradient';
import FooterRightGradient from './FooterRightGradient';

const FooterOne = ({ className }: { className?: string }) => {
  const t = useSafeTranslations('footer');
  const locale = useSafeLocale();
  const router = useRouter();

  const handleLinkClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/${locale}${href}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={cn('bg-secondary dark:bg-background-8 relative overflow-hidden', className)}>
      {/* <!-- right gradient --> */}
      <FooterRightGradient />

      {/* <!-- left gradient --> */}
      <FooterLeftGradient />
      <div className="main-container px-5">
        <div className="grid grid-cols-12 justify-between gap-x-0 gap-y-16 pt-16 pb-12 xl:pt-[90px]">
          <div className="col-span-12 xl:col-span-4">
            <RevealAnimation delay={0.3}>
              <div className="max-w-[306px]">
                <figure>
                  <Image src={darkLogo} alt="NextSass Logo" />
                </figure>
                <p className="text-accent/60 text-tagline-1 mt-4 mb-7 font-normal">
                  {t('description')}
                </p>
                <div className="flex items-center gap-3">
                  <Link target="_blank" href="https://www.facebook.com" className="footer-social-link">
                    <span className="sr-only">Facebook</span>
                    <Image className="size-6" src={facebook} alt="Facebook" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px"></div>
                  <Link target="_blank" href="https://www.instagram.com" className="footer-social-link">
                    <span className="sr-only">Instagram</span>
                    <Image className="size-6" src={instagram} alt="Instagram" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px"></div>
                  <Link target="_blank" href="https://www.youtube.com" className="footer-social-link">
                    <span className="sr-only">Youtube</span>
                    <Image className="size-6" src={youtube} alt="Youtube" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px"></div>
                  <Link target="_blank" href="https://www.linkedin.com" className="footer-social-link">
                    <span className="sr-only">LinkedIn</span>
                    <Image className="size-6" src={linkedin} alt="LinkedIn" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px"></div>
                  <Link target="_blank" href="https://www.dribbble.com" className="footer-social-link">
                    <span className="sr-only">Dribbble</span>
                    <Image className="size-6" src={dribbble} alt="Dribbble" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px"></div>
                  <Link target="_blank" href="https://www.behance.net" className="footer-social-link">
                    <span className="sr-only">Behance</span>
                    <Image className="size-6" src={behance} alt="Behance" />
                  </Link>
                </div>
              </div>
            </RevealAnimation>
          </div>
          <div className="col-span-12 grid grid-cols-12 gap-x-0 gap-y-8 xl:col-span-8">
            <div className="col-span-12 md:col-span-6">
              <RevealAnimation delay={0.5}>
                <div className="space-y-8">
                  <p className="sm:text-heading-6 text-tagline-1 text-primary-50 font-normal">{t('support.title')}</p>
                  <ul className="space-y-3 sm:space-y-5">
                    <li>
                      <a href={`/${locale}/faq`} onClick={handleLinkClick('/faq')} className="footer-link cursor-pointer">
                        {t('support.faq')}
                      </a>
                    </li>
                    <li>
                      <a href={`/${locale}/#contact`} onClick={handleLinkClick('/#contact')} className="footer-link cursor-pointer">
                        {t('company.contact')}
                      </a>
                    </li>
                  </ul>
                </div>
              </RevealAnimation>
            </div>
            <div className="col-span-12 md:col-span-6">
              <RevealAnimation delay={0.6}>
                <div className="space-y-8">
                  <p className="sm:text-heading-6 text-tagline-1 text-primary-50 font-normal">{t('legal.title')}</p>
                  <ul className="space-y-3 sm:space-y-5">
                    <li>
                      <a href={`/${locale}/terms-conditions`} onClick={handleLinkClick('/terms-conditions')} className="footer-link cursor-pointer">
                        {t('legal.terms')}
                      </a>
                    </li>
                    <li>
                      <a href={`/${locale}/privacy-policy`} onClick={handleLinkClick('/privacy-policy')} className="footer-link cursor-pointer">
                        {t('legal.privacy')}
                      </a>
                    </li>
                  </ul>
                </div>
              </RevealAnimation>
            </div>
          </div>
        </div>
        {/* Risk Disclaimer Section */}
        <div className="mt-12 mb-8">
          <RevealAnimation delay={0.7}>
            <div className="bg-red-50 dark:bg-red-900/10 border-3 border-red-300 dark:border-red-700 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400 mb-3">
                    {t('riskDisclaimer.title')}
                  </h3>

                  <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>{t('riskDisclaimer.tradingRisk')}</strong> {t('riskDisclaimer.tradingRiskText')}
                    </p>

                    <p>
                      <strong>{t('riskDisclaimer.notFinancialAdvice')}</strong> {t('riskDisclaimer.notFinancialAdviceText')}
                    </p>

                    <p>
                      <strong>{t('riskDisclaimer.pastPerformance')}</strong> {t('riskDisclaimer.pastPerformanceText')}
                    </p>

                    <p>
                      <strong>{t('riskDisclaimer.capitalAtRisk')}</strong> {t('riskDisclaimer.capitalAtRiskText')}
                    </p>

                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        <strong>{t('riskDisclaimer.secpCompliance')}</strong> {t('riskDisclaimer.secpComplianceText')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>
        </div>

        <div className="relative pt-[26px] pb-[100px] text-center">
          <FooterDivider />
          <RevealAnimation delay={0.8} offset={10} start="top 105%">
            <p className="text-tagline-1 text-primary-50 font-normal">
              {t('copyright')}
            </p>
          </RevealAnimation>
        </div>
      </div>
      <ThemeToggle />
    </footer>
  );
};

FooterOne.displayName = 'FooterOne';
export default FooterOne;
