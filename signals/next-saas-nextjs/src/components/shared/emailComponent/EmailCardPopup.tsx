'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface EmailCardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { name: string; email: string }) => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  cancelText?: string;
  headerColor?: string;
  className?: string;
}

const EmailCardPopup = ({
  isOpen,
  onClose,
  onSubmit,
  title = 'Premium Access',
  subtitle = 'Join traders accessing exclusive drill content',
  buttonText = 'Get Access',
  cancelText = 'Cancel',
  headerColor = 'bg-primary-500',
  className,
}: EmailCardPopupProps) => {
  // STEP 4: Real-time email validation function
  const validateEmailRealtime = (email: string): { isValid: boolean; message: string; suggestion?: string } => {
    if (!email) {
      return { isValid: false, message: '' };
    }

    // Check basic format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }

    // Check for common typos
    const commonTypos = [
      { wrong: 'gmail.con', correct: 'gmail.com' },
      { wrong: 'gmail.co', correct: 'gmail.com' },
      { wrong: 'gmai.com', correct: 'gmail.com' },
      { wrong: 'gmial.com', correct: 'gmail.com' },
      { wrong: 'yahoo.con', correct: 'yahoo.com' },
      { wrong: 'hotmail.con', correct: 'hotmail.com' },
      { wrong: 'outlook.con', correct: 'outlook.com' },
    ];

    for (const typo of commonTypos) {
      if (email.includes(typo.wrong)) {
        return {
          isValid: false,
          message: 'Check your email',
          suggestion: `Did you mean ${email.replace(typo.wrong, typo.correct)}?`
        };
      }
    }

    return { isValid: true, message: '' };
  };

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [emailSuggestion, setEmailSuggestion] = useState<string>('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', email: '' });
      setErrors({ name: '', email: '' });
      setEmailSuggestion('');
    }
  }, [isOpen]);

  // Validate form
  const validateForm = () => {
    const newErrors = { name: '', email: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default behavior - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Form submitted:', formData);
      }

      // Reset and close on success
      setFormData({ name: '', email: '' });
      setErrors({ name: '', email: '' });
      onClose();
    } catch (error: any) {
      console.error('Submission error:', error);

      // STEP 5: Better error messages based on error type
      let errorMessage = 'Unable to send verification email. Please try again.';

      if (error.message) {
        if (error.message.includes('rate limit') || error.message.includes('too many')) {
          errorMessage = '⏰ Too many attempts. Please wait 2 minutes before trying again.';
        } else if (error.message.includes('invalid') || error.message.includes('email')) {
          errorMessage = '📧 Email format is incorrect. Example: name@example.com';
        } else if (error.message.includes('already') || error.message.includes('exists')) {
          errorMessage = '✓ This email is already verified! Check your inbox for previous emails.';
        } else if (error.message.includes('network') || error.message.includes('connection')) {
          errorMessage = '📡 Connection issue. Please check your internet and try again.';
        } else if (error.message.includes('server') || error.message.includes('500')) {
          errorMessage = '🔧 Our servers are having trouble. Please try again in a few minutes.';
        }
      }

      setErrors({ ...errors, email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (rect && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) {
      onClose();
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'w-full max-w-md rounded-2xl overflow-hidden',
        'bg-white dark:bg-gray-900',
        'shadow-xl border border-gray-200 dark:border-gray-700 outline-none',
        'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        className,
      )}
      onClick={handleBackdropClick}
      onClose={onClose}>
      {/* Google-style Header */}
      <div className="relative px-6 pt-6 pb-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 md:w-10 md:h-10 min-h-[44px] min-w-[44px] touch-manipulation hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400"
          aria-label="Close dialog">
          <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Google-style Icon */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Google-style Title & Subtitle */}
          <h2 className="text-xl font-normal text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>

      {/* Google-style Form Content */}
      <div className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field - Google Style */}
          <div className="space-y-1">
            <label htmlFor="popup-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              id="popup-name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={cn(
                'w-full px-3 py-3 rounded-md',
                'border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200',
                errors.name && 'border-red-500 focus:ring-red-500',
              )}
              disabled={loading}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email Field - Google Style */}
          <div className="space-y-1">
            <label htmlFor="popup-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="popup-email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
                if (emailSuggestion) setEmailSuggestion('');
              }}
              onBlur={(e) => {
                const email = e.target.value;
                if (email) {
                  const validation = validateEmailRealtime(email);
                  if (!validation.isValid) {
                    setErrors({ ...errors, email: validation.message });
                    if (validation.suggestion) {
                      setEmailSuggestion(validation.suggestion);
                    }
                  }
                }
              }}
              className={cn(
                'w-full px-3 py-3 rounded-md',
                'border border-gray-300 dark:border-gray-600',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200',
                errors.email && 'border-red-500 focus:ring-red-500',
              )}
              disabled={loading}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            {emailSuggestion && (
              <button
                type="button"
                onClick={() => {
                  const suggestedEmail = emailSuggestion.split(' ').pop()?.replace('?', '') || '';
                  setFormData({ ...formData, email: suggestedEmail });
                  setEmailSuggestion('');
                  setErrors({ ...errors, email: '' });
                }}
                className="text-blue-600 dark:text-blue-400 text-xs mt-1 hover:underline block"
              >
                {emailSuggestion}
              </button>
            )}
          </div>

          {/* Single Button - Google Style */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}>
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  buttonText
                )}
              </span>
            </button>
          </div>

          {/* Google-style Privacy Notice */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 px-2">
            By submitting, you agree to our privacy policy and terms of service
          </p>
        </form>
      </div>
    </dialog>
  );
};

EmailCardPopup.displayName = 'EmailCardPopup';

export default EmailCardPopup;
