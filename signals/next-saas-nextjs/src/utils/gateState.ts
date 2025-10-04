/**
 * Gate State Management
 * Handles localStorage persistence for gate flow
 */

import { GateFlowMechanism, GateState, GateType } from '@/mechanisms/gateFlowMechanism';
import { GATE_CONFIG } from '@/config/gates';

const STORAGE_KEY = GATE_CONFIG.timing.storageKey;

// ============================================================================
// EXTENDED STATE (includes metadata)
// ============================================================================

export interface ExtendedGateState extends GateState {
  // Timestamps
  sessionStart: number;
  emailProvidedAt: number | null;
  brokerVerifiedAt: number | null;

  // Tracking
  brokerClickId: string | null;
  lastBannerShown: number | null;
  bannerDismissCount: number;

  // History
  drillHistory: DrillView[];
}

export interface DrillView {
  signalId: number;
  timestamp: number;
  beforeEmail: boolean;
}

// ============================================================================
// DEFAULT STATE
// ============================================================================

const createDefaultState = (): ExtendedGateState => {
  return {
    // Core state
    hasEmail: false,
    hasBrokerAccount: false,
    drillsViewed: 0,
    drillsViewedAfterEmail: 0,

    // Timestamps
    sessionStart: Date.now(),
    emailProvidedAt: null,
    brokerVerifiedAt: null,

    // Tracking
    brokerClickId: null,
    lastBannerShown: null,
    bannerDismissCount: 0,

    // History
    drillHistory: [],
  };
};

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

/**
 * Get gate state from localStorage
 */
export const getGateState = (): ExtendedGateState => {
  if (typeof window === 'undefined') return createDefaultState();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultState();

    const state: ExtendedGateState = JSON.parse(stored);

    // Check if session expired (24 hours)
    const sessionAge = Date.now() - state.sessionStart;
    if (sessionAge > GATE_CONFIG.timing.sessionExpiry) {
      // Session expired - reset but keep user state
      return {
        ...createDefaultState(),
        hasEmail: state.hasEmail,
        hasBrokerAccount: state.hasBrokerAccount,
        emailProvidedAt: state.emailProvidedAt,
        brokerVerifiedAt: state.brokerVerifiedAt,
      };
    }

    // Validate state
    if (!GateFlowMechanism.validateState(state)) {
      console.warn('Invalid gate state detected, resetting');
      return createDefaultState();
    }

    return state;
  } catch (error) {
    console.error('Error reading gate state:', error);
    return createDefaultState();
  }
};

/**
 * Save gate state to localStorage
 */
export const saveGateState = (state: ExtendedGateState): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving gate state:', error);
  }
};

/**
 * Update gate state with partial data
 */
export const updateGateState = (updates: Partial<ExtendedGateState>): ExtendedGateState => {
  const current = getGateState();
  const updated = {
    ...current,
    ...updates,
  };
  saveGateState(updated);
  return updated;
};

/**
 * Reset all gate state
 */
export const resetGateState = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// ============================================================================
// DRILL TRACKING
// ============================================================================

/**
 * Record a drill view
 */
export const recordDrillView = (signalId: number): ExtendedGateState => {
  const state = getGateState();

  // Check if already viewed this signal in this session
  const alreadyViewed = state.drillHistory.some(
    (view) => view.signalId === signalId
  );

  if (alreadyViewed) {
    // Don't count duplicate views
    return state;
  }

  // Add to history
  const drillView: DrillView = {
    signalId,
    timestamp: Date.now(),
    beforeEmail: !state.hasEmail,
  };

  // Increment drill view using mechanism
  const newCoreState = GateFlowMechanism.incrementDrillView(state);

  // Update extended state
  return updateGateState({
    ...newCoreState,
    drillHistory: [...state.drillHistory, drillView],
  });
};

/**
 * Get drills viewed count
 */
export const getDrillsViewedCount = (): number => {
  return getGateState().drillsViewed;
};

/**
 * Get drills viewed after email
 */
export const getDrillsViewedAfterEmail = (): number => {
  return getGateState().drillsViewedAfterEmail;
};

// ============================================================================
// EMAIL GATE ACTIONS
// ============================================================================

/**
 * Mark email as provided
 */
export const setEmailProvided = (email: string): ExtendedGateState => {
  const state = getGateState();

  // Transition using mechanism
  const newCoreState = GateFlowMechanism.transitionToEmailUser(state);

  return updateGateState({
    ...newCoreState,
    emailProvidedAt: Date.now(),
  });
};

/**
 * Check if user has provided email
 */
export const hasEmailProvided = (): boolean => {
  return getGateState().hasEmail;
};

// ============================================================================
// BROKER GATE ACTIONS
// ============================================================================

/**
 * Record broker link click
 */
export const recordBrokerClick = (clickId: string): ExtendedGateState => {
  return updateGateState({
    brokerClickId: clickId,
  });
};

/**
 * Mark broker account as verified
 */
export const setBrokerVerified = (): ExtendedGateState => {
  const state = getGateState();

  // Transition using mechanism
  const newCoreState = GateFlowMechanism.transitionToBrokerUser(state);

  return updateGateState({
    ...newCoreState,
    brokerVerifiedAt: Date.now(),
  });
};

/**
 * Check if user has broker account
 */
export const hasBrokerAccount = (): boolean => {
  return getGateState().hasBrokerAccount;
};

// ============================================================================
// BROKER PROMOTION BANNER
// ============================================================================

/**
 * Record banner shown
 */
export const recordBannerShown = (): ExtendedGateState => {
  const state = getGateState();
  return updateGateState({
    lastBannerShown: Date.now(),
  });
};

/**
 * Record banner dismissed
 */
export const recordBannerDismissed = (): ExtendedGateState => {
  const state = getGateState();
  return updateGateState({
    lastBannerShown: Date.now(),
    bannerDismissCount: state.bannerDismissCount + 1,
  });
};

/**
 * Check if banner should show
 */
export const shouldShowBanner = (currentSignal?: { confidence: number; currentProfit: number }): boolean => {
  const state = getGateState();
  const config = GATE_CONFIG.brokerPromotion;

  if (!config.enabled) return false;
  if (!state.hasEmail) return false;
  if (state.hasBrokerAccount) return false;

  // Check frequency
  if (state.lastBannerShown) {
    const minutesSince = (Date.now() - state.lastBannerShown) / 1000 / 60;
    if (minutesSince < config.frequencyMinutes) return false;
  }

  // Check triggers
  const meetsViewCount = state.drillsViewedAfterEmail >= config.minSignalsAfterEmail;
  const meetsConfidence = currentSignal && currentSignal.confidence > config.minSignalConfidence;
  const isProfitable = config.showOnProfitableSignal && currentSignal && currentSignal.currentProfit > 0;

  return meetsViewCount || !!meetsConfidence || !!isProfitable;
};

// ============================================================================
// GATE DECISION HELPERS
// ============================================================================

/**
 * Get which gate (if any) should be shown for a drill attempt
 */
export const getGateForDrill = (drillNumber: number): GateType => {
  const state = getGateState();
  const decision = GateFlowMechanism.canAccessDrill(drillNumber, state);

  return decision.gateToShow;
};

/**
 * Check if user can access a drill
 */
export const canAccessDrill = (drillNumber: number): boolean => {
  const state = getGateState();
  const decision = GateFlowMechanism.canAccessDrill(drillNumber, state);

  return decision.canAccess;
};

/**
 * Get user's current stage
 */
export const getCurrentStage = () => {
  const state = getGateState();
  return GateFlowMechanism.getUserStage(state);
};

/**
 * Get remaining drills before next gate
 */
export const getRemainingDrills = (): number => {
  const state = getGateState();
  return GateFlowMechanism.getRemainingDrills(state);
};

// ============================================================================
// EXPORTS
// ============================================================================

export const GateStateManager = {
  // State management
  getGateState,
  saveGateState,
  updateGateState,
  resetGateState,

  // Drill tracking
  recordDrillView,
  getDrillsViewedCount,
  getDrillsViewedAfterEmail,

  // Email gate
  setEmailProvided,
  hasEmailProvided,

  // Broker gate
  recordBrokerClick,
  setBrokerVerified,
  hasBrokerAccount,

  // Banner
  recordBannerShown,
  recordBannerDismissed,
  shouldShowBanner,

  // Decision helpers
  getGateForDrill,
  canAccessDrill,
  getCurrentStage,
  getRemainingDrills,
} as const;

export default GateStateManager;
