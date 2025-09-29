'use client';

import Link from 'next/link';
import { useModalContext } from '@/context/ModalContext';
import EmailGateWrapper from '@/components/shared/emailGate/EmailGateWrapper';
import RevealAnimation from '@/components/animation/RevealAnimation';

const DrillExamplePage = () => {
  const { emailGate } = useModalContext();

  // Show different content based on email submission status
  const hasAccess = emailGate.hasSubmittedEmail;

  return (
    <EmailGateWrapper
      source="drill_example_page"
      title="Unlock Premium Drill Content"
      subtitle="Join thousands of traders accessing our exclusive drill materials">
      <div className="min-h-screen bg-background-1 dark:bg-background-8 py-16">
        <div className="main-container">
          <div className="max-w-4xl mx-auto">
            {/* Back to Main Menu Button */}
            <RevealAnimation>
              <div className="mb-8">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-background-2 dark:bg-background-7 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-background-3 dark:hover:bg-background-6 transition-colors duration-200 text-secondary dark:text-accent"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Main Menu
                </Link>
              </div>
            </RevealAnimation>

            {/* Page Header */}
            <div className="text-center space-y-6 mb-12">
              <RevealAnimation>
                <span className="badge badge-green">Premium Drill</span>
              </RevealAnimation>
              <RevealAnimation delay={0.1}>
                <h1 className="text-heading-2 text-secondary dark:text-accent">
                  Advanced Trading <span className="text-primary-500">Drill Session</span>
                </h1>
              </RevealAnimation>
              <RevealAnimation delay={0.2}>
                <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 max-w-2xl mx-auto">
                  Master advanced trading strategies with our interactive drill content. Access requires registration.
                </p>
              </RevealAnimation>
            </div>

            {/* Drill Preview Content */}
            <div className="space-y-8">
              {/* Content Preview */}
              <RevealAnimation delay={0.3}>
                <div className="bg-background-2 dark:bg-background-7 rounded-[20px] p-8 space-y-6">
                  <h2 className="text-heading-5 text-secondary dark:text-accent">What You&apos;ll Learn</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-tagline-1 font-medium text-secondary dark:text-accent">
                            Risk Management
                          </h3>
                          <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                            Advanced position sizing and risk calculation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-tagline-1 font-medium text-secondary dark:text-accent">
                            Technical Analysis
                          </h3>
                          <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                            Chart patterns and indicator strategies
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-tagline-1 font-medium text-secondary dark:text-accent">
                            Market Psychology
                          </h3>
                          <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                            Understanding market sentiment and timing
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-tagline-1 font-medium text-secondary dark:text-accent">Live Examples</h3>
                          <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                            Real market scenarios and case studies
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealAnimation>

              {/* Content Section - Shows locked or unlocked based on access */}
              <RevealAnimation delay={0.4}>
                <div className="bg-background-2 dark:bg-background-7 rounded-[20px] p-8 text-center space-y-6 relative overflow-hidden">
                  {!hasAccess && (
                    /* Lock Overlay - Only show if no access */
                    <div className="absolute inset-0 bg-background-1/80 dark:bg-background-8/80 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary-500/20 rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-primary-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-8V7a2 2 0 00-2-2H8a2 2 0 00-2 2v2"
                            />
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-heading-6 text-secondary dark:text-accent">Premium Content</h3>
                          <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                            This drill contains advanced trading strategies and live market analysis.
                          </p>
                        </div>
                        <button
                          data-testid="unlock-drill-button"
                          onClick={emailGate.openEmailGate}
                          className="btn btn-primary btn-lg">
                          <span>Unlock Drill Content</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Content - Blurred if no access, clear if has access */}
                  <div
                    data-testid="drill-content"
                    className={`space-y-6 ${!hasAccess ? 'filter blur-sm' : ''}`}>
                    <h2 className="text-heading-5 text-secondary dark:text-accent">Interactive Drill Session</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-heading-6 text-secondary dark:text-accent">Chart Analysis</h3>
                        <div className="h-48 bg-background-3 dark:bg-background-6 rounded-xl"></div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-heading-6 text-secondary dark:text-accent">Trading Scenarios</h3>
                        <div className="space-y-3">
                          <div className="h-12 bg-background-3 dark:bg-background-6 rounded-lg"></div>
                          <div className="h-12 bg-background-3 dark:bg-background-6 rounded-lg"></div>
                          <div className="h-12 bg-background-3 dark:bg-background-6 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-heading-6 text-secondary dark:text-accent">Practice Exercises</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-background-3 dark:bg-background-6 rounded-xl"></div>
                        <div className="h-24 bg-background-3 dark:bg-background-6 rounded-xl"></div>
                        <div className="h-24 bg-background-3 dark:bg-background-6 rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealAnimation>

              {/* Alternative Access Button - Only show if no access */}
              {!hasAccess && (
                <RevealAnimation delay={0.5}>
                  <div className="text-center">
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-4">
                      Ready to dive deep into advanced trading strategies?
                    </p>
                    <button
                      data-testid="start-drill-button"
                      onClick={emailGate.openEmailGate}
                      className="btn btn-secondary btn-lg">
                      <span>Start Advanced Drill</span>
                    </button>
                  </div>
                </RevealAnimation>
              )}

              {/* Success Message - Only show if has access */}
              {hasAccess && (
                <RevealAnimation delay={0.5}>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-[20px] p-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-heading-6">Full Access Granted</span>
                    </div>
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mt-2">
                      You have complete access to all drill materials and interactive content.
                    </p>
                  </div>
                </RevealAnimation>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmailGateWrapper>
  );
};

export default DrillExamplePage;
