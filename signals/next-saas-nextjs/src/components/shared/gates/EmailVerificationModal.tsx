'use client';

import { useState, useEffect } from 'react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  email: string;
  onResend: () => Promise<void>;
  onClose: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  email,
  onResend,
  onClose,
}: EmailVerificationModalProps) {
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds(cooldownSeconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      setCooldownSeconds(120); // 2 minute cooldown
    } catch (error) {
      console.error('Failed to resend:', error);
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-background-1 dark:bg-background-6 rounded-[20px] max-w-md w-full p-8 shadow-2xl transform transition-all duration-300 scale-100">
          {/* Email Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
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
          <h2 className="text-heading-5 font-bold text-secondary dark:text-accent mb-4 text-center">
            Check Your Email
          </h2>

          {/* Description */}
          <p className="text-tagline-2 text-secondary dark:text-accent mb-6 text-center">
            We've sent a magic link to{' '}
            <span className="font-semibold text-primary-500">{email}</span>
          </p>

          <p className="text-tagline-3 text-secondary/70 dark:text-accent/70 mb-8 text-center">
            Click the link in your email to verify your account and unlock all drills.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {cooldownSeconds > 0 ? (
              <div className="text-center py-3 px-4 bg-background-2 dark:bg-background-7 rounded-lg">
                <p className="text-tagline-3 text-secondary/70 dark:text-accent/70">
                  Resend available in{' '}
                  <span className="font-semibold text-primary-500">
                    {Math.floor(cooldownSeconds / 60)}:{String(cooldownSeconds % 60).padStart(2, '0')}
                  </span>
                </p>
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="w-full btn btn-md btn-primary hover:btn-secondary dark:hover:btn-accent before:content-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full btn btn-md btn-outline hover:btn-primary dark:hover:btn-accent before:content-none"
            >
              Close
            </button>
          </div>

          {/* Help text */}
          <p className="text-tagline-3 text-secondary/60 dark:text-accent/60 mt-6 text-center">
            Don't see the email? Check your spam folder.
          </p>
        </div>
      </div>
    </>
  );
}
