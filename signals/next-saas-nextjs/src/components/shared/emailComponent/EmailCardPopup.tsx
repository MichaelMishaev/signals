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
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });
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
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ ...errors, email: 'Something went wrong. Please try again.' });
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
        'w-full max-w-lg rounded-[20px] overflow-hidden',
        'bg-background-1 dark:bg-background-8',
        'shadow-2xl border-0 outline-none',
        'backdrop:bg-black/70 backdrop:backdrop-blur-sm',
        className,
      )}
      onClick={handleBackdropClick}
      onClose={onClose}>
      {/* Header Section */}
      <div className={cn('relative p-6 text-center text-white', headerColor)}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          aria-label="Close dialog">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-heading-5 font-medium">{title}</h2>
          <p className="text-white/90">{subtitle}</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <fieldset className="space-y-2">
            <label htmlFor="popup-name" className="text-tagline-2 text-secondary dark:text-accent font-medium">
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
                'w-full px-[18px] py-3 rounded-full',
                'border border-stroke-3 dark:border-stroke-7',
                'bg-background-1 dark:bg-background-6',
                'text-secondary dark:text-accent',
                'placeholder:text-secondary/60 dark:placeholder:text-accent/60',
                'focus:outline-none focus:border-primary-500',
                'transition-colors',
                errors.name && 'border-red-500',
              )}
              disabled={loading}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </fieldset>

          {/* Email Field */}
          <fieldset className="space-y-2">
            <label htmlFor="popup-email" className="text-tagline-2 text-secondary dark:text-accent font-medium">
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
              }}
              className={cn(
                'w-full px-[18px] py-3 rounded-full',
                'border border-stroke-3 dark:border-stroke-7',
                'bg-background-1 dark:bg-background-6',
                'text-secondary dark:text-accent',
                'placeholder:text-secondary/60 dark:placeholder:text-accent/60',
                'focus:outline-none focus:border-primary-500',
                'transition-colors',
                errors.email && 'border-red-500',
              )}
              disabled={loading}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </fieldset>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-white dark:btn-white-dark btn-md"
              disabled={loading}>
              <span>{cancelText}</span>
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Privacy Notice */}
          <p className="text-center text-tagline-3 text-secondary/60 dark:text-accent/60 mt-4">
            By submitting, you agree to our privacy policy and terms of service
          </p>
        </form>
      </div>
    </dialog>
  );
};

EmailCardPopup.displayName = 'EmailCardPopup';

export default EmailCardPopup;
