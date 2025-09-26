'use client';

import { useState } from 'react';
import { useModal } from '@/hooks/useModal';
import RevealAnimation from '@/components/animation/RevealAnimation';

const PopupTest = () => {
  // Different modal instances for different popup styles
  const ctaStyleModal = useModal();
  const cardStyleModal = useModal();
  const minimalModal = useModal();
  const premiumModal = useModal();

  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleFormSubmit = (e: React.FormEvent, modalType: string) => {
    e.preventDefault();
    console.log(`Form submitted from ${modalType}:`, formData);
    // Close the appropriate modal
    switch (modalType) {
      case 'cta':
        ctaStyleModal.closeModal();
        break;
      case 'card':
        cardStyleModal.closeModal();
        break;
      case 'minimal':
        minimalModal.closeModal();
        break;
      case 'premium':
        premiumModal.closeModal();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background-1 dark:bg-background-8 py-16">
      <div className="main-container">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <RevealAnimation>
              <span className="badge badge-green">Popup Options</span>
            </RevealAnimation>
            <RevealAnimation delay={0.1}>
              <h1 className="text-heading-2 text-secondary dark:text-accent">
                Choose Your <span className="text-primary-500">Drill Access</span> Popup
              </h1>
            </RevealAnimation>
            <RevealAnimation delay={0.2}>
              <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 max-w-2xl mx-auto">
                Select the popup style that best fits your drill page. All follow the site&apos;s design system and
                patterns.
              </p>
            </RevealAnimation>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Option 1: CTA Style Popup */}
            <RevealAnimation delay={0.3}>
              <div className="bg-background-2 dark:bg-background-7 rounded-[20px] p-6 space-y-4">
                <h3 className="text-heading-6 text-secondary dark:text-accent">CTA Style</h3>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                  Based on existing newsletter forms with badge and clean inputs
                </p>
                <button onClick={ctaStyleModal.openModal} className="btn btn-primary btn-md w-full">
                  <span>Preview CTA Style</span>
                </button>
              </div>
            </RevealAnimation>

            {/* Option 2: Card Style Popup */}
            <RevealAnimation delay={0.4}>
              <div className="bg-background-2 dark:bg-background-7 rounded-[20px] p-6 space-y-4">
                <h3 className="text-heading-6 text-secondary dark:text-accent">Card Style</h3>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                  Contact form inspired design with shadow and structured layout
                </p>
                <button onClick={cardStyleModal.openModal} className="btn btn-secondary btn-md w-full">
                  <span>Preview Card Style</span>
                </button>
              </div>
            </RevealAnimation>

            {/* Option 3: Minimal Popup */}
            <RevealAnimation delay={0.5}>
              <div className="bg-background-2 dark:bg-background-7 rounded-[20px] p-6 space-y-4">
                <h3 className="text-heading-6 text-secondary dark:text-accent">Minimal Style</h3>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                  Clean and compact popup with essential elements only
                </p>
                <button onClick={minimalModal.openModal} className="btn btn-white dark:btn-white-dark btn-md w-full">
                  <span>Preview Minimal Style</span>
                </button>
              </div>
            </RevealAnimation>

            {/* Option 4: Premium Popup */}
            <RevealAnimation delay={0.6}>
              <div className="bg-background-2 dark:bg-background-7 rounded-[20px] p-6 space-y-4">
                <h3 className="text-heading-6 text-secondary dark:text-accent">Premium Style</h3>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                  Enhanced design with gradient and premium visual elements
                </p>
                <button onClick={premiumModal.openModal} className="btn btn-green btn-md w-full">
                  <span>Preview Premium Style</span>
                </button>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </div>

      {/* CTA Style Popup Modal */}
      <dialog
        ref={ctaStyleModal.modalRef}
        className="modal-overlay modal-close fixed top-0 left-0 !z-[9999] h-full w-full bg-black/70"
        onClick={(e) => e.target === e.currentTarget && ctaStyleModal.closeModal()}>
        <div
          ref={ctaStyleModal.contentRef}
          className="modal-content fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-background-1 dark:bg-background-8 rounded-[20px] p-8 shadow-2">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <span className="badge badge-cyan">Access Required</span>
              <h2 className="text-heading-5 text-secondary dark:text-accent">Continue to Drill Content</h2>
              <p className="text-tagline-1 text-secondary/70 dark:text-accent/70">
                Please provide your details to access premium drill materials.
              </p>
            </div>

            <form onSubmit={(e) => handleFormSubmit(e, 'cta')} className="space-y-4">
              <fieldset className="text-left space-y-2">
                <label htmlFor="cta-name" className="text-tagline-2 text-secondary dark:text-accent font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="cta-name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500 placeholder:font-normal font-normal"
                  required
                />
              </fieldset>

              <fieldset className="text-left space-y-2">
                <label htmlFor="cta-email" className="text-tagline-2 text-secondary dark:text-accent font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="cta-email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500 placeholder:font-normal font-normal"
                  required
                />
              </fieldset>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={ctaStyleModal.closeModal}
                  className="flex-1 btn btn-white dark:btn-white-dark btn-md">
                  <span>Cancel</span>
                </button>
                <button type="submit" className="flex-1 btn btn-primary btn-md">
                  <span>Access Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Card Style Popup Modal */}
      <dialog
        ref={cardStyleModal.modalRef}
        className="modal-overlay modal-close fixed top-0 left-0 !z-[9999] h-full w-full bg-black/70"
        onClick={(e) => e.target === e.currentTarget && cardStyleModal.closeModal()}>
        <div
          ref={cardStyleModal.contentRef}
          className="modal-content fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-background-1 dark:bg-background-8 rounded-[20px] shadow-3">
          {/* Header */}
          <div className="bg-primary-500 rounded-t-[20px] p-6 text-center text-white relative">
            <button
              onClick={cardStyleModal.closeModal}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10" />
                </svg>
              </div>
              <h2 className="text-heading-5 font-medium">Premium Access</h2>
              <p className="text-white/90">Join traders accessing exclusive drill content</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={(e) => handleFormSubmit(e, 'card')} className="space-y-6">
              <fieldset className="space-y-2">
                <label htmlFor="card-name" className="text-tagline-1 text-secondary dark:text-accent font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="card-name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500 placeholder:font-normal font-normal"
                  required
                />
              </fieldset>

              <fieldset className="space-y-2">
                <label htmlFor="card-email" className="text-tagline-1 text-secondary dark:text-accent font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="card-email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500 placeholder:font-normal font-normal"
                  required
                />
              </fieldset>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={cardStyleModal.closeModal}
                  className="flex-1 btn btn-white dark:btn-white-dark btn-md">
                  <span>Cancel</span>
                </button>
                <button type="submit" className="flex-1 btn btn-primary btn-md">
                  <span>Get Access</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      {/* Minimal Popup Modal */}
      <dialog
        ref={minimalModal.modalRef}
        className="modal-overlay modal-close fixed top-0 left-0 !z-[9999] h-full w-full bg-black/70"
        onClick={(e) => e.target === e.currentTarget && minimalModal.closeModal()}>
        <div
          ref={minimalModal.contentRef}
          className="modal-content fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-background-1 dark:bg-background-8 rounded-[20px] p-6 shadow-1">
          <button
            onClick={minimalModal.closeModal}
            className="absolute -top-2 -right-2 w-6 h-6 bg-secondary dark:bg-accent text-white dark:text-secondary rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform">
            ✕
          </button>

          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-heading-6 text-secondary dark:text-accent">Quick Access</h2>
              <p className="text-tagline-3 text-secondary/60 dark:text-accent/60">Enter details to continue</p>
            </div>

            <form onSubmit={(e) => handleFormSubmit(e, 'minimal')} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-tagline-2 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500 placeholder:font-normal font-normal"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-tagline-2 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500 placeholder:font-normal font-normal"
                required
              />
              <button type="submit" className="w-full btn btn-secondary btn-sm">
                <span>Continue</span>
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Premium Popup Modal */}
      <dialog
        ref={premiumModal.modalRef}
        className="modal-overlay modal-close fixed top-0 left-0 !z-[9999] h-full w-full bg-black/70"
        onClick={(e) => e.target === e.currentTarget && premiumModal.closeModal()}>
        <div
          ref={premiumModal.contentRef}
          className="modal-content fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-t-[20px] p-6 text-white text-center relative">
            <button
              onClick={premiumModal.closeModal}
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
              <h2 className="text-heading-5">Exclusive Content</h2>
              <p className="text-white/90">Unlock premium drill materials</p>
            </div>
          </div>

          <div className="bg-background-1 dark:bg-background-8 rounded-b-[20px] p-6 shadow-3">
            <form onSubmit={(e) => handleFormSubmit(e, 'premium')} className="space-y-5">
              <div className="space-y-4">
                <fieldset className="space-y-2">
                  <label htmlFor="premium-name" className="text-tagline-2 text-secondary dark:text-accent font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="premium-name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-2 dark:bg-background-7 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:font-normal font-normal"
                    required
                  />
                </fieldset>

                <fieldset className="space-y-2">
                  <label htmlFor="premium-email" className="text-tagline-2 text-secondary dark:text-accent font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="premium-email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-2 dark:bg-background-7 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:font-normal font-normal"
                    required
                  />
                </fieldset>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full btn btn-primary btn-md">
                  <span>Get Instant Access</span>
                </button>
              </div>

              <p className="text-tagline-3 text-center text-secondary/60 dark:text-accent/60">
                By continuing, you agree to receive premium content
              </p>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PopupTest;
