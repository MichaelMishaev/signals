'use client';

import { useModalContext } from '@/context/ModalContext';
import RevealAnimation from '@/components/animation/RevealAnimation';

export default function DrillExampleClient() {
  const { emailGate } = useModalContext();
  const hasAccess = emailGate.hasSubmittedEmail;

  return (
    <>
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
    </>
  );
}
