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

  // Actions
  onDrillView: (signalId: number) => void;
  onEmailSubmit: (email: string) => void;
  onBrokerVerify: () => void;
  onBrokerClick: (clickId: string) => void;
  closeGate: () => void;
  dismissBanner: () => void;

  // Helpers
  canAccessDrill: (drillNumber: number) => boolean;
  getGateForDrill: (drillNumber: number) => GateType;
}

export const useGateFlow = (currentSignal?: { confidence: number; currentProfit: number }): UseGateFlowReturn => {
  const [activeGate, setActiveGate] = useState<GateType>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [state, setState] = useState(() => getGateState());

  // Refresh state from localStorage
  const refreshState = useCallback(() => {
    setState(getGateState());
  }, []);

  // Initialize and set up storage listener
  useEffect(() => {
    refreshState();

    // Listen for storage changes (cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'gate_flow_state') {
        refreshState();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshState]);

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
    const newState = recordDrillView(signalId);
    setState(newState);

    // Check if a gate should be shown
    const drillNumber = newState.drillsViewed;
    const gateToShow = getGateForDrill(drillNumber + 1); // +1 for next attempt

    if (gateToShow) {
      setActiveGate(gateToShow);
    }
  }, []);

  /**
   * Handle email submission
   */
  const onEmailSubmit = useCallback((email: string) => {
    const newState = setEmailProvided(email);
    setState(newState);
    setActiveGate(null); // Close gate
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

    // Actions
    onDrillView,
    onEmailSubmit,
    onBrokerVerify,
    onBrokerClick,
    closeGate,
    dismissBanner,

    // Helpers
    canAccessDrill,
    getGateForDrill: getGateForDrillHelper,
  };
};

export default useGateFlow;
