/**
 * Gate Manager
 * Central component that manages which gate to display
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

  console.log('[GateManager] Rendering with activeGate:', activeGate);

  // Listen for toast events
  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent;
      const message = customEvent.detail.translate
        ? t(customEvent.detail.message)
        : customEvent.detail.message;

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
