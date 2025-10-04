/**
 * Popup State Manager with localStorage
 * Handles all popup state persistence and session management
 */

import { POPUP_CONFIG, PopupType } from '@/config/popups';

const STORAGE_KEY = 'trading_popup_state';

export interface PopupState {
  actionCount: number; // Resets per session
  sessionStart: number; // Timestamp
  popupsShown: {
    idle: number; // Count of times shown
    contentAccess: number; // Count of times shown
    fourthAction: boolean; // Shown once only (ever)
    exitIntent: number; // Count of times shown
    exitIntentLastShown: number; // Timestamp of last exit intent
  };
  userState: {
    emailSubscribed: boolean;
    brokerAccountOpened: boolean;
  };
}

const DEFAULT_STATE: PopupState = {
  actionCount: 0,
  sessionStart: Date.now(),
  popupsShown: {
    idle: 0,
    contentAccess: 0,
    fourthAction: false,
    exitIntent: 0,
    exitIntentLastShown: 0,
  },
  userState: {
    emailSubscribed: false,
    brokerAccountOpened: false,
  },
};

/**
 * Get popup state from localStorage
 */
export const getPopupState = (): PopupState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;

    const state: PopupState = JSON.parse(stored);

    // Check if session expired (24 hours)
    const sessionAge = Date.now() - state.sessionStart;
    if (sessionAge > POPUP_CONFIG.timing.sessionExpiry) {
      // Reset session-specific data but keep persistent flags
      return {
        ...DEFAULT_STATE,
        sessionStart: Date.now(),
        popupsShown: {
          ...DEFAULT_STATE.popupsShown,
          fourthAction: state.popupsShown.fourthAction, // Keep this persistent
        },
        userState: state.userState, // Keep user state
      };
    }

    return state;
  } catch (error) {
    console.error('Error reading popup state:', error);
    return DEFAULT_STATE;
  }
};

/**
 * Save popup state to localStorage
 */
export const savePopupState = (state: PopupState): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving popup state:', error);
  }
};

/**
 * Update popup state with partial data
 */
export const updatePopupState = (updates: Partial<PopupState>): PopupState => {
  const current = getPopupState();
  const updated = {
    ...current,
    ...updates,
    popupsShown: {
      ...current.popupsShown,
      ...(updates.popupsShown || {}),
    },
    userState: {
      ...current.userState,
      ...(updates.userState || {}),
    },
  };
  savePopupState(updated);
  return updated;
};

/**
 * Increment action count
 */
export const incrementActionCount = (): number => {
  const state = getPopupState();
  const newCount = state.actionCount + 1;
  updatePopupState({ actionCount: newCount });
  return newCount;
};

/**
 * Mark popup as shown
 */
export const markPopupShown = (type: PopupType): void => {
  const state = getPopupState();

  if (type === 'fourthAction') {
    updatePopupState({
      popupsShown: {
        ...state.popupsShown,
        fourthAction: true,
      },
    });
  } else if (type === 'exitIntent') {
    updatePopupState({
      popupsShown: {
        ...state.popupsShown,
        exitIntent: state.popupsShown.exitIntent + 1,
        exitIntentLastShown: Date.now(),
      },
    });
  } else {
    updatePopupState({
      popupsShown: {
        ...state.popupsShown,
        [type]: state.popupsShown[type] + 1,
      },
    });
  }
};

/**
 * Check if popup should be shown
 */
export const shouldShowPopup = (type: PopupType): boolean => {
  const state = getPopupState();

  switch (type) {
    case 'idle':
    case 'contentAccess':
      return true; // Always allowed

    case 'fourthAction':
      return !state.popupsShown.fourthAction; // Once only

    case 'exitIntent': {
      // Only for email subscribers without broker account
      if (!state.userState.emailSubscribed || state.userState.brokerAccountOpened) {
        return false;
      }

      // Check debounce time (30 seconds)
      const timeSinceLastShown = Date.now() - state.popupsShown.exitIntentLastShown;
      return timeSinceLastShown > POPUP_CONFIG.timing.exitIntentDebounce;
    }

    default:
      return false;
  }
};

/**
 * Set email subscription status
 */
export const setEmailSubscribed = (subscribed: boolean): void => {
  updatePopupState({
    userState: {
      ...getPopupState().userState,
      emailSubscribed: subscribed,
    },
  });
};

/**
 * Set broker account status
 */
export const setBrokerAccountOpened = (opened: boolean): void => {
  updatePopupState({
    userState: {
      ...getPopupState().userState,
      brokerAccountOpened: opened,
    },
  });
};

/**
 * Reset all popup state (for testing)
 */
export const resetPopupState = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Get current action count
 */
export const getActionCount = (): number => {
  return getPopupState().actionCount;
};

/**
 * Check if user has subscribed email
 */
export const hasEmailSubscription = (): boolean => {
  return getPopupState().userState.emailSubscribed;
};

/**
 * Check if user has opened broker account
 */
export const hasBrokerAccount = (): boolean => {
  return getPopupState().userState.brokerAccountOpened;
};
