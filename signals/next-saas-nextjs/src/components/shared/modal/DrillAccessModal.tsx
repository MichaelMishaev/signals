'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useModalContext } from '@/context/ModalContext';

interface DrillAccessModalProps {
  onSubmit?: (data: { name: string; email: string }) => void;
}

const DrillAccessModal = ({ onSubmit }: DrillAccessModalProps) => {
  const t = useTranslations('modals.drillAccess');
  const tCommon = useTranslations('modals.common');
  const { drillAccessModal } = useModalContext();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Default behavior - just log the data
      console.log('Drill access form submitted:', formData);
    }

    // Close the modal
    drillAccessModal.closeModal();

    // Reset form data
    setFormData({ name: '', email: '' });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      drillAccessModal.closeModal();
    }
  };

  return (
    <dialog
      ref={drillAccessModal.modalRef}
      className="modal-overlay modal-close fixed top-0 left-0 !z-[9999] h-full w-full bg-black/70"
      onClick={handleOverlayClick}>
      <div
        ref={drillAccessModal.contentRef}
        className="modal-content fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-background-1 dark:bg-background-8 rounded-[20px] p-8 shadow-2">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <span className="badge badge-cyan">{t('locked')}</span>
            <h2 className="text-heading-5 text-secondary dark:text-accent">{t('title')}</h2>
            <p className="text-tagline-1 text-secondary/70 dark:text-accent/70">
              {t('subtitle')}
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <fieldset className="text-left space-y-2">
              <label htmlFor="drill-name" className="text-tagline-2 text-secondary dark:text-accent font-medium">
                Full Name
              </label>
              <input
                type="text"
                id="drill-name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-[18px] py-3 rounded-full border border-stroke-3 dark:border-stroke-7 bg-background-1 dark:bg-background-6 text-secondary dark:text-accent placeholder:text-secondary/60 dark:placeholder:text-accent/60 focus:outline-none focus:border-primary-500 placeholder:font-normal font-normal"
                required
              />
            </fieldset>

            <fieldset className="text-left space-y-2">
              <label htmlFor="drill-email" className="text-tagline-2 text-secondary dark:text-accent font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="drill-email"
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
                onClick={drillAccessModal.closeModal}
                className="flex-1 btn btn-white dark:btn-white-dark btn-md">
                <span>{tCommon('cancel')}</span>
              </button>
              <button type="submit" className="flex-1 btn btn-primary btn-md">
                <span>{t('verifyButton')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

DrillAccessModal.displayName = 'DrillAccessModal';
export default DrillAccessModal;
