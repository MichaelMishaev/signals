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
import ThemeToggle from '../ThemeToggle';
import FooterDivider from './FooterDivider';
import FooterLeftGradient from './FooterLeftGradient';
import FooterRightGradient from './FooterRightGradient';

const FooterOne = ({ className }: { className?: string }) => {
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
                  Turpis tortor nunc sed amet et faucibus vitae morbi congue sed id mauris.
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
            <div className="col-span-12 md:col-span-4">
              <RevealAnimation delay={0.4}>
                <div className="space-y-8">
                  <p className="sm:text-heading-6 text-tagline-1 text-primary-50 font-normal">Company</p>
                  <ul className="space-y-3 sm:space-y-5">
                    <li>
                      <Link href="/about-01" className="footer-link">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/career" className="footer-link">
                        Career
                      </Link>
                    </li>
                    <li>
                      <Link href="/case-study" className="footer-link">
                        Case Studies
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" className="footer-link">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </RevealAnimation>
            </div>
            <div className="col-span-12 md:col-span-4">
              <RevealAnimation delay={0.5}>
                <div className="space-y-8">
                  <p className="sm:text-heading-6 text-tagline-1 text-primary-50 font-normal">Support</p>
                  <ul className="space-y-3 sm:space-y-5">
                    <li>
                      <Link href="/faq" className="footer-link">
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="/documentation" className="footer-link">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="/tutorial" className="footer-link">
                        Tutorial
                      </Link>
                    </li>
                    <li>
                      <Link href="/support" className="footer-link">
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </RevealAnimation>
            </div>
            <div className="col-span-12 md:col-span-4">
              <RevealAnimation delay={0.6}>
                <div className="space-y-8">
                  <p className="sm:text-heading-6 text-tagline-1 text-primary-50 font-normal">Legal Policies</p>
                  <ul className="space-y-3 sm:space-y-5">
                    <li>
                      <Link href="/terms-conditions" className="footer-link">
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="footer-link">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/refund-policy" className="footer-link">
                        Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/gdpr" className="footer-link">
                        GDPR Compliance
                      </Link>
                    </li>
                    <li>
                      <Link href="/affiliate-policy" className="footer-link">
                        Affiliate Policy
                      </Link>
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
            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 md:p-8">
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
                    Important Risk Disclaimer
                  </h3>

                  <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                    <p>
                      <strong>Trading Risk Warning:</strong> Trading foreign exchange, commodities, and stocks on margin
                      carries a high level of risk and may not be suitable for all investors.
                    </p>

                    <p>
                      <strong>Not Financial Advice:</strong> Signals provided are for educational purposes only and should not be considered as financial advice or investment recommendations.
                    </p>

                    <p>
                      <strong>Past Performance:</strong> Past performance is not indicative of future results. Historical win rates do not guarantee future trading success.
                    </p>

                    <p>
                      <strong>Capital at Risk:</strong> Only trade with money you can afford to lose. Never trade with borrowed money or funds required for essential expenses.
                    </p>

                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        <strong>SECP Compliance:</strong> TradeSignal PK operates in accordance with SECP guidelines. License No: [Pending]
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
              Copyright &copy;NextSaaS – smart application for modern business
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
