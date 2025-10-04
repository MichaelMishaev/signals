/**
 * Gate State Management
 * Handles localStorage persistence for gate flow
 */

import { GateFlowMechanism, GateState, GateType } from '@/mechanisms/gateFlowMechanism';
import { GATE_CONFIG } from '@/config/gates';

const BASE_STORAGE_KEY = GATE_CONFIG.timing.storageKey;

/**
 * Get storage key for current user
 * Uses email-based keys for multi-user separation
 */
const getStorageKey = (email?: string | null): string => {
  if (email) {
    // Sanitize email for use as localStorage key
    const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    return `${BASE_STORAGE_KEY}_${sanitizedEmail}`;
  }
  return `${BASE_STORAGE_KEY}_anonymous`;
};

// ============================================================================
// EXTENDED STATE (includes metadata)
// ============================================================================

export interface ExtendedGateState extends GateState {
  // User identification
  userEmail: string | null;

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

    // User identification
    userEmail: null,

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
 * Auto-detects the user's state by checking all gate keys
 */
export const getGateState = (forceEmail?: string | null): ExtendedGateState => {
  if (typeof window === 'undefined') return createDefaultState();

  try {
    // Try to load from specified email first (if provided)
    if (forceEmail) {
      const emailKey = getStorageKey(forceEmail);
      const emailStored = localStorage.getItem(emailKey);
      if (emailStored) {
        const state: ExtendedGateState = JSON.parse(emailStored);
        return validateAndMaybeExpire(state);
      }
    }

    // Auto-detect: Find any gate state key in localStorage
    const allKeys = Object.keys(localStorage);
    const gateKeys = allKeys.filter(key => key.startsWith(BASE_STORAGE_KEY));

    if (gateKeys.length > 0) {
      // Prefer email-based keys over anonymous
      const emailKey = gateKeys.find(key => key !== `${BASE_STORAGE_KEY}_anonymous`);
      const keyToUse = emailKey || gateKeys[0];

      const stored = localStorage.getItem(keyToUse);
      if (stored) {
        const state: ExtendedGateState = JSON.parse(stored);
        console.log('[GATE] 🔍 Auto-detected user state from key:', keyToUse);
        return validateAndMaybeExpire(state);
      }
    }

    // No state found, return default
    console.log('[GATE] 🆕 Creating new default state');
    return createDefaultState();
  } catch (error) {
    console.error('Error loading gate state:', error);
    return createDefaultState();
  }
};

/**
 * Validate state and handle expiry
 */
const validateAndMaybeExpire = (state: ExtendedGateState): ExtendedGateState => {
  // Check if session expired (24 hours)
  const sessionAge = Date.now() - state.sessionStart;
  if (sessionAge > GATE_CONFIG.timing.sessionExpiry) {
    // Session expired - reset but keep user state
    return {
      ...createDefaultState(),
      userEmail: state.userEmail,
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
};

/**
 * Save gate state to localStorage
 */
export const saveGateState = (state: ExtendedGateState): void => {
  if (typeof window === 'undefined') return;

  try {
    const storageKey = getStorageKey(state.userEmail);
    localStorage.setItem(storageKey, JSON.stringify(state));

    console.log('[GATE] 💾 State saved', {
      storageKey,
      userEmail: state.userEmail || 'anonymous',
      drillsViewed: state.drillsViewed,
      hasEmail: state.hasEmail,
      hasBroker: state.hasBrokerAccount,
    });
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
export const resetGateState = (email?: string | null): void => {
  if (typeof window !== 'undefined') {
    const state = getGateState();
    const emailToUse = email || state.userEmail;
    const storageKey = getStorageKey(emailToUse);
    localStorage.removeItem(storageKey);

    console.log('[GATE] 🗑️ State reset', {
      storageKey,
      userEmail: emailToUse || 'anonymous',
    });
  }
};

/**
 * Switch to a different user's gate state
 * Call this when user logs in/out
 */
export const switchUser = (newEmail: string | null): ExtendedGateState => {
  console.log('[GATE] 🔄 Switching user', {
    from: getGateState().userEmail || 'anonymous',
    to: newEmail || 'anonymous',
  });

  return getGateState(newEmail);
};

// ============================================================================
// DRILL TRACKING
// ============================================================================

/**
 * Record a drill view
 */
export const recordDrillView = (signalId: number): ExtendedGateState => {
  const state = getGateState();

  console.log('[GATE] 🔍 recordDrillView called', {
    signalId,
    currentDrillsViewed: state.drillsViewed,
    drillHistory: state.drillHistory.map(d => d.signalId),
  });

  // Check if already viewed this signal in this session
  const alreadyViewed = state.drillHistory.some(
    (view) => view.signalId === signalId
  );

  if (alreadyViewed) {
    console.log('[GATE] ⏭️  Drill view skipped (duplicate)', {
      signalId: signalId,
      drillsViewed: state.drillsViewed,
    });
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

  console.log('[GATE] 📊 Drill view recorded', {
    timestamp: new Date().toISOString(),
    signalId: signalId,
    drillsViewed: newCoreState.drillsViewed,
    beforeEmail: !state.hasEmail,
    currentStage: state.hasEmail ? (state.hasBrokerAccount ? 'broker_user' : 'email_user') : 'anonymous',
  });

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

  console.log('[GATE] ✉️ EMAIL GATE - Email submitted', {
    timestamp: new Date().toISOString(),
    email: email,
    drillsViewedBefore: state.drillsViewed,
    transition: 'anonymous → email_user',
  });

  // Transition using mechanism
  const newCoreState = GateFlowMechanism.transitionToEmailUser(state);

  // Delete old anonymous storage if exists
  if (typeof window !== 'undefined') {
    const anonKey = getStorageKey(null);
    localStorage.removeItem(anonKey);
  }

  return updateGateState({
    ...newCoreState,
    userEmail: email,
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
  console.log('[GATE] 🔗 Broker link clicked', {
    timestamp: new Date().toISOString(),
    clickId: clickId,
    brokerUrl: GATE_CONFIG.brokerUrl,
  });

  return updateGateState({
    brokerClickId: clickId,
  });
};

/**
 * Mark broker account as verified
 */
export const setBrokerVerified = (): ExtendedGateState => {
  const state = getGateState();

  console.log('[GATE] 💎 BROKER GATE - Broker account verified', {
    timestamp: new Date().toISOString(),
    drillsViewedBefore: state.drillsViewed,
    drillsAfterEmail: state.drillsViewedAfterEmail,
    transition: 'email_user → broker_user',
  });

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
  console.log('[GATE] 🎁 Broker Promotion Banner SHOWN', {
    timestamp: new Date().toISOString(),
    drillsViewedAfterEmail: state.drillsViewedAfterEmail,
    lastShown: state.lastBannerShown ? new Date(state.lastBannerShown).toISOString() : 'never',
  });
  return updateGateState({
    lastBannerShown: Date.now(),
  });
};

/**
 * Record banner dismissed
 */
export const recordBannerDismissed = (): ExtendedGateState => {
  const state = getGateState();
  console.log('[GATE] ❌ Broker Promotion Banner DISMISSED', {
    timestamp: new Date().toISOString(),
    totalDismissals: state.bannerDismissCount + 1,
  });
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

  if (decision.gateToShow) {
    console.log(`[GATE] 🚪 ${decision.gateToShow.toUpperCase()} GATE TRIGGERED`, {
      timestamp: new Date().toISOString(),
      drillNumber: drillNumber,
      drillsViewed: state.drillsViewed,
      currentStage: decision.currentStage,
      reason: decision.reason,
    });
  }

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
