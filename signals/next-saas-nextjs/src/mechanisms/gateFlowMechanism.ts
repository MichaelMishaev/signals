/**
 * GATE FLOW MECHANISM
 * Pure logic for email and broker gates - platform agnostic
 * Perfect for visualization, testing, and documentation
 *
 * Visual Flow:
 * ┌─────────────────────────────────────────┐
 * │ Homepage (Signal List) - FREE           │
 * └──────────────┬──────────────────────────┘
 *                ↓
 * ┌─────────────────────────────────────────┐
 * │ Drill 1, 2, 3 - FREE                    │
 * │ (View full signal details)              │
 * └──────────────┬──────────────────────────┘
 *                ↓
 * ┌─────────────────────────────────────────┐
 * │ Drill 4 Attempt                         │
 * │ ⚠️  TRIGGER: Email Gate                 │
 * └──────────────┬──────────────────────────┘
 *                ↓
 *       ┌────────┴────────┐
 *       │  Email Provided? │
 *       └────────┬────────┘
 *          NO ←──┤ YES
 *          ↓     └──→ Continue
 *     BLOCKED         ↓
 *                ┌────────────────────┐
 *                │ Drills 5-9 - FREE  │
 *                │ (6 more signals)   │
 *                └──────┬─────────────┘
 *                       ↓
 *                ┌────────────────────┐
 *                │ Drill 10 Attempt   │
 *                │ ⚠️  TRIGGER: Broker │
 *                └──────┬─────────────┘
 *                       ↓
 *              ┌────────┴────────┐
 *              │ Broker Account?  │
 *              └────────┬────────┘
 *                 NO ←──┤ YES
 *                 ↓     └──→ Unlimited
 *            BLOCKED         Access ✅
 */

// ============================================================================
// TYPES
// ============================================================================

export type GateType = 'email' | 'broker' | null;
export type UserStage = 'anonymous' | 'email_user' | 'broker_user';

export interface GateState {
  hasEmail: boolean;
  hasBrokerAccount: boolean;
  drillsViewed: number;
  drillsViewedAfterEmail: number;
}

export interface GateDecision {
  canAccess: boolean;
  gateToShow: GateType;
  reason: string;
  currentStage: UserStage;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const GATE_CONSTANTS = {
  // Gate identifiers
  GATES: {
    EMAIL: 'email' as const,
    BROKER: 'broker' as const,
  },

  // User stages
  STAGES: {
    ANONYMOUS: 'anonymous' as const,
    EMAIL_USER: 'email_user' as const,
    BROKER_USER: 'broker_user' as const,
  },

  // Thresholds (when gates appear)
  THRESHOLDS: {
    EMAIL_GATE: 3,      // Show email gate on 4th drill attempt
    BROKER_GATE: 9,     // Show broker gate on 10th drill attempt (6th after email)
  },

  // Access limits
  LIMITS: {
    ANONYMOUS_MAX_DRILLS: 3,        // Anonymous: 3 drills
    EMAIL_USER_MAX_DRILLS: 9,       // Email user: 9 drills total (3 + 6)
    BROKER_USER_MAX_DRILLS: Infinity, // Broker user: unlimited
  },
} as const;

// ============================================================================
// STATE MACHINE
// ============================================================================

/**
 * Determine user's current stage based on their state
 */
export const getUserStage = (state: GateState): UserStage => {
  if (state.hasBrokerAccount) {
    return GATE_CONSTANTS.STAGES.BROKER_USER;
  }
  if (state.hasEmail) {
    return GATE_CONSTANTS.STAGES.EMAIL_USER;
  }
  return GATE_CONSTANTS.STAGES.ANONYMOUS;
};

/**
 * Get maximum drills allowed for user's stage
 */
export const getMaxDrillsAllowed = (stage: UserStage): number => {
  switch (stage) {
    case GATE_CONSTANTS.STAGES.ANONYMOUS:
      return GATE_CONSTANTS.LIMITS.ANONYMOUS_MAX_DRILLS;
    case GATE_CONSTANTS.STAGES.EMAIL_USER:
      return GATE_CONSTANTS.LIMITS.EMAIL_USER_MAX_DRILLS;
    case GATE_CONSTANTS.STAGES.BROKER_USER:
      return GATE_CONSTANTS.LIMITS.BROKER_USER_MAX_DRILLS;
    default:
      return 0;
  }
};

// ============================================================================
// GATE LOGIC
// ============================================================================

/**
 * Check if email gate should be shown
 */
export const shouldShowEmailGate = (state: GateState): boolean => {
  return (
    !state.hasEmail && // User hasn't provided email
    state.drillsViewed >= GATE_CONSTANTS.THRESHOLDS.EMAIL_GATE // Viewed 3+ drills
  );
};

/**
 * Check if broker gate should be shown
 */
export const shouldShowBrokerGate = (state: GateState): boolean => {
  return (
    state.hasEmail && // User has provided email
    !state.hasBrokerAccount && // User hasn't opened broker account
    state.drillsViewed >= GATE_CONSTANTS.THRESHOLDS.BROKER_GATE // Viewed 9+ drills
  );
};

/**
 * Determine which gate (if any) should be shown
 */
export const getNextGate = (state: GateState): GateType => {
  // Email gate has priority
  if (shouldShowEmailGate(state)) {
    return GATE_CONSTANTS.GATES.EMAIL;
  }

  // Broker gate second
  if (shouldShowBrokerGate(state)) {
    return GATE_CONSTANTS.GATES.BROKER;
  }

  // No gate needed
  return null;
};

// ============================================================================
// ACCESS CONTROL
// ============================================================================

/**
 * Check if user can access a specific drill number
 */
export const canAccessDrill = (
  drillNumber: number,
  state: GateState
): GateDecision => {
  const stage = getUserStage(state);
  const maxAllowed = getMaxDrillsAllowed(stage);
  const gateToShow = getNextGate(state);

  // Drill numbers are 1-indexed, so drill 4 means they've viewed 3 drills
  const drillsAlreadyViewed = drillNumber - 1;

  // Check if within allowed limit
  const canAccess = drillsAlreadyViewed < maxAllowed;

  // Determine reason
  let reason = '';
  if (canAccess) {
    reason = `Access granted. Stage: ${stage}, Drill ${drillNumber}/${maxAllowed}`;
  } else if (gateToShow === GATE_CONSTANTS.GATES.EMAIL) {
    reason = `Email gate required. Viewed ${drillsAlreadyViewed}/3 free drills`;
  } else if (gateToShow === GATE_CONSTANTS.GATES.BROKER) {
    reason = `Broker gate required. Viewed ${drillsAlreadyViewed}/9 drills`;
  } else {
    reason = 'Access denied';
  }

  return {
    canAccess,
    gateToShow: canAccess ? null : gateToShow,
    reason,
    currentStage: stage,
  };
};

/**
 * Check if user has unlimited access
 */
export const hasUnlimitedAccess = (state: GateState): boolean => {
  return state.hasBrokerAccount;
};

// ============================================================================
// STATE TRANSITIONS
// ============================================================================

/**
 * Transition: User provides email
 */
export const transitionToEmailUser = (state: GateState): GateState => {
  return {
    ...state,
    hasEmail: true,
    drillsViewedAfterEmail: 0, // Reset counter
  };
};

/**
 * Transition: User opens broker account
 */
export const transitionToBrokerUser = (state: GateState): GateState => {
  return {
    ...state,
    hasBrokerAccount: true,
  };
};

/**
 * Increment drill view count
 */
export const incrementDrillView = (state: GateState): GateState => {
  const newState = {
    ...state,
    drillsViewed: state.drillsViewed + 1,
  };

  // If user has email, also increment post-email counter
  if (state.hasEmail) {
    newState.drillsViewedAfterEmail = state.drillsViewedAfterEmail + 1;
  }

  return newState;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get user-friendly stage description
 */
export const getStageDescription = (stage: UserStage): string => {
  switch (stage) {
    case GATE_CONSTANTS.STAGES.ANONYMOUS:
      return 'Anonymous Visitor (3 free drills)';
    case GATE_CONSTANTS.STAGES.EMAIL_USER:
      return 'Email Subscriber (9 drills total)';
    case GATE_CONSTANTS.STAGES.BROKER_USER:
      return 'Broker Account Holder (unlimited access)';
    default:
      return 'Unknown';
  }
};

/**
 * Get remaining drills before next gate
 */
export const getRemainingDrills = (state: GateState): number => {
  const stage = getUserStage(state);
  const maxAllowed = getMaxDrillsAllowed(stage);
  const remaining = maxAllowed - state.drillsViewed;
  return Math.max(0, remaining);
};

/**
 * Create initial gate state
 */
export const createInitialState = (): GateState => {
  return {
    hasEmail: false,
    hasBrokerAccount: false,
    drillsViewed: 0,
    drillsViewedAfterEmail: 0,
  };
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate gate state
 */
export const validateState = (state: GateState): boolean => {
  // Basic validations
  if (state.drillsViewed < 0) return false;
  if (state.drillsViewedAfterEmail < 0) return false;

  // Logic validations
  if (state.hasBrokerAccount && !state.hasEmail) {
    // Can't have broker without email
    return false;
  }

  if (state.drillsViewedAfterEmail > state.drillsViewed) {
    // Can't have more post-email drills than total
    return false;
  }

  if (!state.hasEmail && state.drillsViewedAfterEmail > 0) {
    // Can't have post-email drills without email
    return false;
  }

  return true;
};

// ============================================================================
// EXPORT MAIN MECHANISM
// ============================================================================

export const GateFlowMechanism = {
  // Constants
  CONSTANTS: GATE_CONSTANTS,

  // State machine
  getUserStage,
  getMaxDrillsAllowed,

  // Gate logic
  shouldShowEmailGate,
  shouldShowBrokerGate,
  getNextGate,

  // Access control
  canAccessDrill,
  hasUnlimitedAccess,

  // State transitions
  transitionToEmailUser,
  transitionToBrokerUser,
  incrementDrillView,

  // Helpers
  getStageDescription,
  getRemainingDrills,
  createInitialState,
  validateState,
} as const;

export default GateFlowMechanism;
