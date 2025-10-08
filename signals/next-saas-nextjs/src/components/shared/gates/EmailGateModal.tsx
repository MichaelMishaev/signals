/**
 * Email Gate Modal
 * Blocking modal that requires email to continue viewing signals
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { emailGateConfig } from '@/config/gates';

interface EmailGateModalProps {
  isOpen: boolean;
  onSubmit: (email: string) => void;
  onClose?: () => void; // Optional - gate can be dismissible or blocking
  blocking?: boolean; // If true, cannot be dismissed (required for drill content)
}

export const EmailGateModal: React.FC<EmailGateModalProps> = ({
  isOpen,
  onSubmit,
  onClose,
  blocking = true, // Default to blocking (cannot dismiss)
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle ESC key to close modal (only if not blocking)
  useEffect(() => {
    if (!isOpen || !onClose || blocking) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, blocking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(email);
      // Success - parent will close modal
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Handle backdrop click (only if not blocking)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose && !blocking) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div
          className={cn(
            'bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md',
            'transform transition-all duration-300',
            'relative',
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
        >
          {/* Close Button - Only show if not blocking */}
          {onClose && !blocking && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="p-6 sm:p-8">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔓</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
              {emailGateConfig.title}
            </h2>

            {/* Subtitle */}
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              {emailGateConfig.subtitle}
            </p>

            {/* Benefits */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {emailGateConfig.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border-2',
                    'bg-white dark:bg-gray-800',
                    'border-gray-300 dark:border-gray-700',
                    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                    'text-gray-900 dark:text-white',
                    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                    'transition-colors',
                    error && 'border-red-500'
                  )}
                  required
                  disabled={isSubmitting}
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full px-6 py-3 rounded-lg font-bold text-white',
                  'bg-gradient-to-r from-blue-600 to-purple-600',
                  'hover:from-blue-700 hover:to-purple-700',
                  'transition-all transform hover:scale-105',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                )}
              >
                {isSubmitting ? 'Processing...' : emailGateConfig.ctaText}
              </button>
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              {emailGateConfig.privacyNote}
            </p>

            {/* Back to Browse Button - Always allow navigation */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/"
                className="block w-full text-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ← Back to Browse Signals
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailGateModal;
