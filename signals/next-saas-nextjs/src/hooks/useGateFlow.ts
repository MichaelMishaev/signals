/**
 * useGateFlow Hook
 * React integration for gate flow mechanism
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { GateType } from '@/mechanisms/gateFlowMechanism';
import {
  GateStateManager,
  getGateState,
  recordDrillView,
  setEmailProvided,
  setBrokerVerified,
  canAccessDrill as checkCanAccessDrill,
  getGateForDrill,
  getCurrentStage,
  getRemainingDrills,
  shouldShowBanner,
  recordBannerShown,
  recordBannerDismissed,
  recordBrokerClick,
} from '@/utils/gateState';

export interface UseGateFlowReturn {
  // State
  hasEmail: boolean;
  hasBroker: boolean;
  drillsViewed: number;
  drillsViewedAfterEmail: number;
  currentStage: string;
  remainingDrills: number;

  // Gate visibility
  activeGate: GateType;
  showBanner: boolean;

  // Verification state
  pendingVerification: boolean;
  pendingEmail: string | null;

  // Actions
  onDrillView: (signalId: number) => void;
  onEmailSubmit: (email: string) => void;
  onBrokerVerify: () => void;
  onBrokerClick: (clickId: string) => void;
  closeGate: () => void;
  dismissBanner: () => void;
  resendVerification: () => Promise<void>;
  closeVerificationModal: () => void;

  // Helpers
  canAccessDrill: (drillNumber: number) => boolean;
  getGateForDrill: (drillNumber: number) => GateType;
}

export const useGateFlow = (currentSignal?: { confidence: number; currentProfit: number }): UseGateFlowReturn => {
  const [activeGate, setActiveGate] = useState<GateType>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [state, setState] = useState(() => getGateState());
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Refresh state from localStorage
  const refreshState = useCallback(() => {
    setState(getGateState());
  }, []);

  // Initialize and set up storage listener
  useEffect(() => {
    refreshState();

    // Check for email verification cookie
    const checkVerificationCookie = () => {
      const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
      };

      const verifiedEmail = getCookie('gate_email_verified');
      if (verifiedEmail && !state.hasEmail) {
        console.log('[useGateFlow] Email verification detected, updating gate state');

        // Update gate state to grant access
        const newState = setEmailProvided(verifiedEmail);
        setState(newState);

        // Clear the cookie
        document.cookie = 'gate_email_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    };

    checkVerificationCookie();

    // Listen for storage changes (cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'gate_flow_state') {
        refreshState();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshState, state.hasEmail]);

  // Update banner visibility
  useEffect(() => {
    const bannerShouldShow = shouldShowBanner(currentSignal);
    setShowBanner(bannerShouldShow);
  }, [state, currentSignal]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Record drill view and check if gate should appear
   */
  const onDrillView = useCallback((signalId: number) => {
    console.log('[useGateFlow] onDrillView called with signalId:', signalId);

    const newState = recordDrillView(signalId);
    console.log('[useGateFlow] After recordDrillView, newState:', {
      drillsViewed: newState.drillsViewed,
      hasEmail: newState.hasEmail,
      hasBroker: newState.hasBrokerAccount,
    });

    setState(newState);

    // Check if a gate should be shown based on CURRENT state
    // After recording this drill view, check if we've hit a gate threshold
    const gateToShow = getGateForDrill(newState.drillsViewed);

    console.log('[useGateFlow] After drill view #', newState.drillsViewed, ', checking for gate. Result:', gateToShow);

    if (gateToShow) {
      console.log('[useGateFlow] Setting active gate:', gateToShow);
      setActiveGate(gateToShow);
    } else {
      console.log('[useGateFlow] No gate needed');
    }
  }, []);

  /**
   * Handle email submission
   */
  const onEmailSubmit = useCallback(async (email: string) => {
    try {
      // FIRST: Check if email is already verified in database (cross-browser verification)
      const dbCheckResponse = await fetch('/api/auth/check-email-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (dbCheckResponse.ok) {
        const dbStatus = await dbCheckResponse.json();

        if (dbStatus.verified) {
          console.log('[useGateFlow] Email already verified in database - granting immediate access!');

          // Email is verified! Grant access immediately
          const newState = setEmailProvided(email);
          setState(newState);

          // Close gate
          setActiveGate(null);

          // Show success message
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('show-toast', {
              detail: {
                message: 'Welcome back! Your email is already verified.',
                type: 'success'
              }
            }));
          }

          return; // Exit - user now has access!
        }
      }

      // Email not verified - proceed with sending magic link
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '/';

      const response = await fetch('/api/auth/drill-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: '',
          source: 'gate_flow',
          action: 'send-magic-link',
          returnUrl: currentUrl
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('[useGateFlow] Magic link sent to:', email);

        // Store email temporarily (not verified yet)
        localStorage.setItem('pending_email_verification', JSON.stringify({
          email,
          timestamp: Date.now()
        }));

        // Set pending verification state
        setPendingEmail(email);
        setPendingVerification(true);

        // Close gate
        setActiveGate(null);

        // Trigger toast notification
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
              message: 'gate.emailSent',
              type: 'success',
              translate: true
            }
          }));
        }
      } else {
        console.error('[useGateFlow] Failed to send magic link:', data.error);

        // Show error toast
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
              message: data.message || 'gate.emailFailed',
              type: 'error',
              translate: !data.message // Only translate if using default message
            }
          }));
        }
      }
    } catch (error) {
      console.error('[useGateFlow] Error sending magic link:', error);

      // Show error toast
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: {
            message: 'gate.emailError',
            type: 'error',
            translate: true
          }
        }));
      }
    }
  }, []);

  /**
   * Handle broker verification
   */
  const onBrokerVerify = useCallback(() => {
    const newState = setBrokerVerified();
    setState(newState);
    setActiveGate(null); // Close gate
  }, []);

  /**
   * Handle broker link click
   */
  const onBrokerClick = useCallback((clickId: string) => {
    const newState = recordBrokerClick(clickId);
    setState(newState);
  }, []);

  /**
   * Close active gate
   */
  const closeGate = useCallback(() => {
    setActiveGate(null);
  }, []);

  /**
   * Dismiss banner
   */
  const dismissBanner = useCallback(() => {
    recordBannerDismissed();
    setShowBanner(false);
  }, []);

  /**
   * Resend verification email
   */
  const resendVerification = useCallback(async () => {
    if (!pendingEmail) return;
    await onEmailSubmit(pendingEmail);
  }, [pendingEmail, onEmailSubmit]);

  /**
   * Close verification modal
   */
  const closeVerificationModal = useCallback(() => {
    setPendingVerification(false);
  }, []);

  // ============================================================================
  // HELPERS
  // ============================================================================

  const canAccessDrill = useCallback((drillNumber: number): boolean => {
    return checkCanAccessDrill(drillNumber);
  }, [state]);

  const getGateForDrillHelper = useCallback((drillNumber: number): GateType => {
    return getGateForDrill(drillNumber);
  }, [state]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    hasEmail: state.hasEmail,
    hasBroker: state.hasBrokerAccount,
    drillsViewed: state.drillsViewed,
    drillsViewedAfterEmail: state.drillsViewedAfterEmail,
    currentStage: getCurrentStage(),
    remainingDrills: getRemainingDrills(),

    // Gate visibility
    activeGate,
    showBanner,

    // Verification state
    pendingVerification,
    pendingEmail,

    // Actions
    onDrillView,
    onEmailSubmit,
    onBrokerVerify,
    onBrokerClick,
    closeGate,
    dismissBanner,
    resendVerification,
    closeVerificationModal,

    // Helpers
    canAccessDrill,
    getGateForDrill: getGateForDrillHelper,
  };
};

export default useGateFlow;
