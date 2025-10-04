import Link from 'next/link';
import EmailGateWrapper from '@/components/shared/emailGate/EmailGateWrapper';
import RevealAnimation from '@/components/animation/RevealAnimation';
import DrillExampleClient from './DrillExampleClient';

const DrillExamplePage = () => {

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

              {/* Content Section with client-side interactivity */}
              <DrillExampleClient />
            </div>
          </div>
        </div>
      </div>
    </EmailGateWrapper>
  );
};

export default DrillExamplePage;
