'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

export type PopupVariant = 'cta' | 'card' | 'minimal' | 'premium' | 'gradient' | 'sidebar' | 'hero' | 'notification';

interface EmailPopupProps {
  variant?: PopupVariant;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { name?: string; email: string }) => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  showName?: boolean;
  className?: string;
}

const EmailPopup = ({
  variant = 'cta',
  isOpen,
  onClose,
  onSubmit,
  title = 'Continue to Premium Content',
  subtitle = 'Enter your details to access exclusive materials',
  buttonText = 'Get Access',
  showName = true,
  className,
}: EmailPopupProps) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(showName ? formData : { email: formData.email });
      }
      setFormData({ name: '', email: '' });
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderVariant = () => {
    switch (variant) {
      case 'cta':
        return (
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <span className="badge badge-cyan">Access Required</span>
              <h2 className="text-heading-5 text-secondary dark:text-accent">{title}</h2>
              <p className="text-tagline-1 text-secondary/70 dark:text-accent/70">{subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {showName && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                  required={showName}
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                required
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 btn btn-white dark:btn-white-dark btn-md">
                  <span>Cancel</span>
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn btn-primary btn-md">
                  <span>{loading ? 'Processing...' : buttonText}</span>
                </button>
              </div>
            </form>
          </div>
        );

      case 'card':
        return (
          <>
            <div className="bg-primary-500 rounded-t-[20px] p-6 text-center text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
                <h2 className="text-heading-5 font-medium">{title}</h2>
                <p className="text-white/90">{subtitle}</p>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {showName && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                    required={showName}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                  required
                />
                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className="flex-1 btn btn-white dark:btn-white-dark btn-md">
                    <span>Cancel</span>
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 btn btn-primary btn-md">
                    <span>{loading ? 'Processing...' : buttonText}</span>
                  </button>
                </div>
              </form>
            </div>
          </>
        );

      case 'minimal':
        return (
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-6 h-6 bg-secondary dark:bg-accent text-white dark:text-secondary rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform">
              ✕
            </button>
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-heading-6 text-secondary dark:text-accent">{title}</h2>
                <p className="text-tagline-3 text-secondary/60 dark:text-accent/60">{subtitle}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                {showName && (
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-tagline-2 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                    required={showName}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-tagline-2 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                  required
                />
                <button type="submit" disabled={loading} className="w-full btn btn-secondary btn-sm">
                  <span>{loading ? 'Processing...' : buttonText}</span>
                </button>
              </form>
            </div>
          </div>
        );

      case 'premium':
        return (
          <>
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-t-[20px] p-6 text-white text-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-6 h-6 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto bg-ns-green rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-heading-5">{title}</h2>
                <p className="text-white/90">{subtitle}</p>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {showName && (
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-2 dark:bg-background-7 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    required={showName}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-2 dark:bg-background-7 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  required
                />
                <button type="submit" disabled={loading} className="w-full btn btn-primary btn-md">
                  <span>{loading ? 'Processing...' : buttonText}</span>
                </button>
                <p className="text-tagline-3 text-center text-secondary/60 dark:text-accent/60">
                  By continuing, you agree to receive premium content
                </p>
              </form>
            </div>
          </>
        );

      case 'gradient':
        return (
          <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-1 rounded-[20px]">
            <div className="bg-background-1 dark:bg-background-8 rounded-[19px] p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <svg
                  className="w-4 h-4 text-secondary dark:text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                    Exclusive Offer
                  </span>
                  <h2 className="text-heading-4 text-secondary dark:text-accent font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {title}
                  </h2>
                  <p className="text-tagline-1 text-secondary/70 dark:text-accent/70">{subtitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {showName && (
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-[18px] py-3 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-purple-500 transition-all"
                      required={showName}
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-[18px] py-3 rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-pink-500 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50">
                    {loading ? 'Processing...' : buttonText}
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'sidebar':
        return (
          <div className="flex h-full">
            <div className="w-1/3 bg-gradient-to-b from-primary-500 to-primary-700 p-6 flex flex-col justify-center items-center text-white rounded-l-[20px]">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-center">Join 10,000+ Traders</h3>
              <p className="text-sm text-white/80 text-center mt-2">Get exclusive insights</p>
            </div>
            <div className="flex-1 p-8 rounded-r-[20px]">
              <button
                onClick={onClose}
                className="float-right w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="space-y-4 mt-4">
                <div>
                  <h2 className="text-heading-5 text-secondary dark:text-accent">{title}</h2>
                  <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mt-2">{subtitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {showName && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                      required={showName}
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                    required
                  />
                  <button type="submit" disabled={loading} className="w-full btn btn-primary btn-md">
                    <span>{loading ? 'Processing...' : buttonText}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div
            className="relative bg-cover bg-center rounded-[20px] overflow-hidden"
            style={{ backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="relative bg-black/40 backdrop-blur-sm p-12">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center space-y-6 text-white">
                <div className="space-y-4">
                  <h1 className="text-heading-3 font-bold">{title}</h1>
                  <p className="text-tagline-1 text-white/90 max-w-md mx-auto">{subtitle}</p>
                </div>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {showName && (
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-full bg-white/20 backdrop-blur text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:border-white/60 transition-all"
                        required={showName}
                      />
                    )}
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-full bg-white/20 backdrop-blur text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:border-white/60 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-primary-600 font-semibold hover:bg-white/90 transition-all disabled:opacity-50">
                    {loading ? 'Processing...' : buttonText}
                  </button>
                </form>
                <p className="text-xs text-white/70">No spam. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        );

      case 'notification':
        return (
          <div className="relative">
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-ns-red rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-sm">NEW</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-heading-6 text-secondary dark:text-accent flex items-center gap-2">
                    <span className="w-2 h-2 bg-ns-green rounded-full animate-pulse"></span>
                    {title}
                  </h3>
                  <p className="text-tagline-3 text-secondary/70 dark:text-accent/70 mt-1">{subtitle}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-6 h-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors ml-4">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                  {showName && (
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                      required={showName}
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-lg bg-ns-green text-white font-medium hover:bg-ns-green/90 transition-all disabled:opacity-50">
                    {loading ? '...' : 'Go'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getDialogClass = () => {
    const baseClass =
      'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-1 dark:bg-background-8 shadow-2xl border-0 backdrop:bg-black/70 outline-none';

    const variantClasses = {
      cta: 'w-full max-w-md rounded-[20px] p-8',
      card: 'w-full max-w-lg rounded-[20px] overflow-hidden',
      minimal: 'w-full max-w-sm rounded-[20px]',
      premium: 'w-full max-w-md rounded-[20px] overflow-hidden',
      gradient: 'w-full max-w-lg bg-transparent p-0',
      sidebar: 'w-full max-w-2xl h-[400px] rounded-[20px] overflow-hidden',
      hero: 'w-full max-w-3xl p-0',
      notification: 'w-full max-w-md rounded-xl',
    };

    return cn(baseClass, variantClasses[variant], className);
  };

  return (
    <dialog ref={dialogRef} className={getDialogClass()} onClick={handleBackdropClick}>
      {renderVariant()}
    </dialog>
  );
};

export default EmailPopup;
