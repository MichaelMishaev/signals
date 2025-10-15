/**
 * Gate Manager
 * Central component that manages which gate to display
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { UseGateFlowReturn } from '@/hooks/useGateFlow';
import EmailGateModal from './EmailGateModal';
import BrokerGateModal from './BrokerGateModal';
import EmailVerificationModal from './EmailVerificationModal';
import Toast, { ToastType } from '../Toast';
import {
  PremiumGlassPopup,
  MinimalElegantPopup,
  BoldGradientPopup,
  ProfessionalDashboardPopup,
  ModernCardPopup,
} from '@/components/popups/TradingPopups5';

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

  // Randomly select a popup design for broker/agent gate (stable for the session)
  const selectedBrokerPopup = useMemo(() => {
    const popups = [
      PremiumGlassPopup,
      MinimalElegantPopup,
      BoldGradientPopup,
      ProfessionalDashboardPopup,
      ModernCardPopup,
    ];
    const randomIndex = Math.floor(Math.random() * popups.length);
    return popups[randomIndex];
  }, []);

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
          // Translate using the message key directly (e.g., 'gate.emailFailed')
          const translated = t(customEvent.detail.message);

          // Check if translation failed (next-intl returns error format instead of throwing)
          if (translated && !translated.startsWith('MISSING_MESSAGE:')) {
            message = translated;
          } else {
            console.warn('[GateManager] Translation not found:', customEvent.detail.message);
            // Fallback to original message
            message = customEvent.detail.message;
          }
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

  const BrokerTradingPopup = selectedBrokerPopup;

  return (
    <>
      {/* Email Gate - BLOCKING (traditional email collection form) */}
      <EmailGateModal
        isOpen={activeGate === 'email'}
        onSubmit={onEmailSubmit}
        onClose={closeGate}
        blocking={true}
      />

      {/* Broker/Agent Gate - Show one of 5 premium trading popups */}
      {activeGate === 'broker' && <BrokerTradingPopup onClose={closeGate} />}

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
