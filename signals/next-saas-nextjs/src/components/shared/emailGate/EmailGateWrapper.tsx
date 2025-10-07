'use client';

import { useEffect, useState } from 'react';
import { useModalContext } from '@/context/ModalContext';
import EmailCardPopup from '../emailComponent/EmailCardPopup';
import DevEmailDebugBar from './DevEmailDebugBar';
import RevealAnimation from '../../animation/RevealAnimation';

interface EmailGateWrapperProps {
  children: React.ReactNode;
  source?: string;
  title?: string;
  subtitle?: string;
}

export default function EmailGateWrapper({
  children,
  source = 'drill_page',
  title = 'Access Premium Drill Content',
  subtitle = 'Get instant access to our exclusive trading drill materials',
}: EmailGateWrapperProps) {
  const { emailGate } = useModalContext();

  // Helper function to get the correct localStorage key
  const getStorageKey = (source: string) => {
    return source.includes('signal_') || source.includes('drill')
      ? 'email_submission_drill_signals'
      : `email_submission_${source}`;
  };
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [recentSubmission, setRecentSubmission] = useState<{email: string; timestamp: number} | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // STEP 1: Add state to track if user dismissed the modal
  const [userDismissedModal, setUserDismissedModal] = useState(() => {
    if (typeof window === 'undefined') return false;
    const dismissedUntil = localStorage.getItem('email-modal-dismissed-until');
    if (dismissedUntil) {
      return Date.now() < parseInt(dismissedUntil);
    }
    return false;
  });

  // Check for recent email submissions IMMEDIATELY on component initialization
  const [initialRecentCheck] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        hasRecentSubmission: false,
        data: null,
        canResend: false
      };
    }

    const recentKey = getStorageKey(source);
    const stored = localStorage.getItem(recentKey);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        const timeSinceSubmission = Date.now() - data.timestamp;
        const COOLDOWN_PERIOD = 2 * 60 * 1000; // 2 minutes (fixed from 5)

        if (timeSinceSubmission < COOLDOWN_PERIOD) {
          return {
            hasRecentSubmission: true,
            data,
            canResend: false
          };
        } else {
          return {
            hasRecentSubmission: true,
            data,
            canResend: true
          };
        }
      } catch (error) {
        console.error('Error parsing recent submission:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(getStorageKey(source));
        }
      }
    }

    return {
      hasRecentSubmission: false,
      data: null,
      canResend: false
    };
  });

  // Set initial state based on immediate check
  useEffect(() => {
    if (initialRecentCheck.hasRecentSubmission) {
      setRecentSubmission(initialRecentCheck.data);
      setCanResend(initialRecentCheck.canResend);
      if (!initialRecentCheck.canResend) {
        setShowVerificationNotice(true);
        setEmailSubmitted(true);
      }
    }
  }, [initialRecentCheck]);

  useEffect(() => {
    // Reset local state when user becomes authenticated or submits email
    if (emailGate.hasSubmittedEmail || emailGate.isAuthenticated) {
      setEmailSubmitted(false);
      setShowVerificationNotice(false);
      setRecentSubmission(null);
      setCanResend(false);
      return;
    }

    // Don't auto-open modal in test environment
    const isTestEnvironment =
      typeof window !== 'undefined' &&
      (window.navigator.userAgent.includes('Playwright') ||
       window.location.hostname === 'localhost' && process.env.NODE_ENV === 'test');

    if (isTestEnvironment) {
      return;
    }

    // Check if we need to show the email gate
    if (!emailGate.isLoading && !emailGate.hasSubmittedEmail && !emailGate.isAuthenticated && !emailSubmitted && !recentSubmission && !userDismissedModal) {
      // Small delay to ensure smooth page load
      const timer = setTimeout(() => {
        emailGate.openEmailGate();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [emailGate.isLoading, emailGate.hasSubmittedEmail, emailGate.isAuthenticated, emailGate, emailSubmitted, recentSubmission, userDismissedModal]);

  const handleEmailSubmit = async (data: { name: string; email: string }) => {
    const result = await emailGate.submitEmail(data.email, data.name, source);

    if (result.success) {
      emailGate.closeEmailGate();

      // Check if email was already verified (cross-browser verification)
      if (result.alreadyVerified) {
        // Email already verified - grant immediate access!
        // Don't set emailSubmitted or show verification notice
        // The useEmailGate hook already set hasSubmittedEmail = true
        console.log('[EmailGateWrapper] Email already verified - granting immediate access');

        // Clear any pending verification notices
        setEmailSubmitted(false);
        setShowVerificationNotice(false);
        setRecentSubmission(null);
        return; // Exit - user now has access to content
      }

      // Email not yet verified - proceed with normal flow
      setEmailSubmitted(true);

      // Store submission data for rate limiting
      const submissionData = {
        email: data.email,
        timestamp: Date.now(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(getStorageKey(source), JSON.stringify(submissionData));
      }
      setRecentSubmission(submissionData);
      setCanResend(false);

      // Show verification notice if email was sent
      if (result.emailSent || result.message?.includes('Check your email')) {
        setShowVerificationNotice(true);
        // Hide notice after 10 seconds
        setTimeout(() => setShowVerificationNotice(false), 10000);
      }
    } else {
      console.error('Failed to submit email:', result.error);

      // Don't close modal on errors - let EmailCardPopup handle the error display
      // The error will be propagated back to the popup through the promise rejection
      throw new Error(result.message || 'Failed to send verification email. Please try again.');
    }
  };

  const handleResendEmail = async () => {
    if (!recentSubmission) return;

    setErrorMessage(null); // Clear any previous errors
    const result = await emailGate.submitEmail(recentSubmission.email, '', source);

    if (result.success) {
      // Update timestamp for new cooldown
      const newSubmissionData = {
        ...recentSubmission,
        timestamp: Date.now(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(getStorageKey(source), JSON.stringify(newSubmissionData));
      }
      setRecentSubmission(newSubmissionData);
      setCanResend(false);
      setShowVerificationNotice(true);

      // Start new cooldown timer
      setTimeout(() => setCanResend(true), 2 * 60 * 1000); // 2 minutes
    } else {
      setErrorMessage(result.message || 'Failed to resend verification email.');
      // Don't reset resend capability on rate limit errors
      if (!result.rateLimited) {
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  return (
    <>
      <DevEmailDebugBar />

      {/* Verification Notice Banner */}
      {showVerificationNotice && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white p-4 text-center animate-slide-down">
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
            <div>
              <p className="font-semibold">Magic link sent to your email!</p>
              <p className="text-sm opacity-90">Click the link in your email to verify and unlock all drills</p>
            </div>
            {emailGate.resendVerificationEmail && (
              <button
                onClick={async () => {
                  const result = await emailGate.resendVerificationEmail();
                  if (result.success) {
                    setShowVerificationNotice(true);
                    setTimeout(() => setShowVerificationNotice(false), 10000);
                  }
                }}
                className="text-sm underline hover:no-underline"
              >
                Resend
              </button>
            )}
          </div>
        </div>
      )}

      <div className={process.env.NODE_ENV === 'development' ? 'pt-10' : ''}>
        {emailGate.hasSubmittedEmail ? (
          children
        ) : emailSubmitted || showVerificationNotice || recentSubmission ? (
          <section className="min-h-screen lg:pt-[180px] pt-[120px] lg:pb-[100px] pb-[70px]">
            <div className="main-container">
              <RevealAnimation delay={0.1}>
                <div className="max-w-[500px] mx-auto bg-background-1 dark:bg-background-6 rounded-[20px] py-14 px-8 text-center">
                  {/* Email Icon */}
                  <div className="mb-8">
                    <div className="w-16 h-16 mx-auto bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-heading-5 font-bold text-secondary dark:text-accent mb-4">
                    Check Your Email
                  </h2>

                  {/* Description */}
                  <p className="text-tagline-2 text-secondary dark:text-accent mb-4">
                    We've sent a magic link to{' '}
                    <span className="font-semibold text-primary-500">
                      {recentSubmission?.email}
                    </span>
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                      ✅ Click the link in your email to verify and unlock content
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Don't see the email? Check your spam folder or wait a few minutes.
                    </p>
                  </div>

                  {/* Error message display */}
                  {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-tagline-3 text-red-600 dark:text-red-400">{errorMessage}</p>
                    </div>
                  )}

                  {/* Resend functionality */}
                  {canResend ? (
                    <div className="mb-4">
                      <button
                        onClick={handleResendEmail}
                        className="btn btn-md btn-primary hover:btn-secondary dark:hover:btn-accent before:content-none"
                      >
                        Resend Verification Email
                      </button>
                    </div>
                  ) : recentSubmission && (
                    <div className="mb-4">
                      <p className="text-tagline-3 text-secondary/70 dark:text-accent/70">
                        Already sent recently. You can resend in{' '}
                        <span className="font-semibold text-primary-500">
                          {Math.ceil((2 * 60 * 1000 - (Date.now() - recentSubmission.timestamp)) / (60 * 1000))} minutes
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Back to Home Button - ALWAYS ALLOW NAVIGATION */}
                  <div className="mb-4">
                    <a
                      href="/"
                      className="btn btn-md btn-outline hover:btn-primary dark:hover:btn-accent before:content-none w-full inline-block text-center"
                    >
                      ← Back to Home
                    </a>
                  </div>

                  {/* Help text */}
                  <p className="text-tagline-3 text-secondary/60 dark:text-accent/60">
                    Need help? Contact our support team.
                  </p>
                </div>
              </RevealAnimation>
            </div>
          </section>
        ) : (
          children
        )}
      </div>

      <EmailCardPopup
        isOpen={emailGate.isOpen}
        onClose={() => {
          // STEP 1: When user closes modal, remember for 24 hours
          const dismissUntil = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
          localStorage.setItem('email-modal-dismissed-until', dismissUntil.toString());
          setUserDismissedModal(true);
          emailGate.closeEmailGate();
        }}
        onSubmit={handleEmailSubmit}
        title={title}
        subtitle={subtitle}
        buttonText="Get Instant Access"
        cancelText="Maybe Later"
        headerColor="bg-gradient-to-r from-primary-500 to-primary-600"
      />
    </>
  );
}