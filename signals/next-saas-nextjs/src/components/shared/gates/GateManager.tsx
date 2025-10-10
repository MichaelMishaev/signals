/**
 * Gate Manager
 * Central component that manages which gate to display
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { UseGateFlowReturn } from '@/hooks/useGateFlow';
import EmailGateModal from './EmailGateModal';
import BrokerGateModal from './BrokerGateModal';
import EmailVerificationModal from './EmailVerificationModal';
import Toast, { ToastType } from '../Toast';

interface GateManagerProps {
  gateFlow: UseGateFlowReturn;
}

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export const GateManager: React.FC<GateManagerProps> = ({ gateFlow }) => {
  const {
    activeGate,
    onEmailSubmit,
    onBrokerClick,
    onBrokerVerify,
    closeGate,
    pendingVerification,
    pendingEmail,
    resendVerification,
    closeVerificationModal,
  } = gateFlow;

  const t = useTranslations();
  const pathname = usePathname();
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  console.log('[GateManager] Rendering with activeGate:', activeGate);

  // ULTRA-SAFETY: Only allow gates on signal pages - prevent any rendering on other pages
  const isSignalPage = pathname?.includes('/signal/');

  // CRITICAL FIX: Close all gates when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      console.log('[GateManager] Unmounting - closing all gates');
      closeGate();
      closeVerificationModal();
    };
  }, [closeGate, closeVerificationModal]);

  // ULTRA-SAFETY: If not on signal page, don't render ANY gates
  if (!isSignalPage) {
    console.log('[GateManager] BLOCKED: Not on signal page, pathname:', pathname);
    return null;
  }

  // Listen for toast events
  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      let message = customEvent.detail.message;

      // Handle translation with proper namespace
      if (customEvent.detail.translate) {
        try {
          // Try to translate with 'common.' prefix
          message = t(`common.${customEvent.detail.message}`);
        } catch (error) {
          console.error('[GateManager] Translation error:', error);
          // Fallback to original message if translation fails
          message = customEvent.detail.message;
        }
      }

      setToast({
        show: true,
        message,
        type: customEvent.detail.type || 'info',
      });
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, [t]);

  return (
    <>
      {/* Email Gate - BLOCKING (cannot be dismissed when accessing drill content) */}
      <EmailGateModal
        isOpen={activeGate === 'email'}
        onSubmit={onEmailSubmit}
        onClose={closeGate}
        blocking={true}
      />

      {/* Broker Gate */}
      <BrokerGateModal
        isOpen={activeGate === 'broker'}
        onBrokerClick={onBrokerClick}
        onAlreadyHaveAccount={onBrokerVerify}
        onClose={closeGate}
      />

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={pendingVerification}
        email={pendingEmail || ''}
        onResend={resendVerification}
        onClose={closeVerificationModal}
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
};

export default GateManager;
