/**
 * Popup System Configuration
 * Single source of truth for all popup content and settings
 */

export const POPUP_CONFIG = {
  // Single URL that all popups link to - change in one place
  brokerUrl: 'https://broker-signup-url.com', // TODO: Update with actual broker URL

  // Popup messages (~15 words each)
  messages: {
    idle: 'Start trading today with 3 free expert signals - Join now',
    contentAccess: 'Unlock exclusive trading signals - Sign up now for free access',
    fourthAction: 'Open broker account today - Get unlimited premium signals monthly',
    exitIntent: 'Wait! Get 3 bonus signals free - Don\'t miss out today',
  },

  // Timing configuration
  timing: {
    idleTimeout: 60000, // 1 minute in milliseconds
    sessionExpiry: 86400000, // 24 hours in milliseconds
    exitIntentDebounce: 30000, // 30 seconds between exit intent triggers
  },

  // Broker account pricing tiers (for 4th action popup)
  pricing: {
    basic: {
      price: 10,
      signals: 10,
      label: '10 free signals monthly',
    },
    standard: {
      price: 30,
      signals: 50,
      label: '50 free signals monthly',
    },
    premium: {
      price: 150,
      signals: 'unlimited',
      label: 'unlimited signals monthly',
    },
  },
} as const;

export type PopupType = 'idle' | 'contentAccess' | 'fourthAction' | 'exitIntent';
