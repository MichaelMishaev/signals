/**
 * Gate System Configuration
 * Single source of truth for email and broker gates
 */

export const GATE_CONFIG = {
  // ============================================================================
  // BROKER URL
  // ============================================================================
  brokerUrl: 'https://broker-signup-url.com', // TODO: Update with actual broker URL

  // ============================================================================
  // EMAIL GATE
  // ============================================================================
  emailGate: {
    // Trigger settings
    triggerAfterDrills: 2, // Show after viewing 2 drills (on 3rd attempt)
    blocking: false, // Can be dismissed - users can browse freely
    required: true, // Must provide email to access drill content

    // UI content
    title: 'Unlock Unlimited Signals',
    subtitle: 'Enter your email to continue viewing premium trading signals',
    benefits: [
      '✓ Real-time entry/exit points',
      '✓ 85%+ win rate signals',
      '✓ Risk management guidance',
      '✓ No credit card required',
    ],

    // Call to action
    ctaText: 'Get Free Access',
    ctaSecondary: null, // No secondary action (hard gate)

    // Legal
    privacyNote: 'We respect your privacy. No spam, unsubscribe anytime.',
  },

  // ============================================================================
  // BROKER GATE
  // ============================================================================
  brokerGate: {
    // Trigger settings
    triggerAfterEmailDrills: 8, // Show on 10th drill (8th after email)
    blocking: true, // Cannot be dismissed
    required: true, // Must open broker account to continue

    // UI content
    title: 'Upgrade to Premium Access',
    subtitle: "You've viewed 9 drills. Open a broker account for unlimited access.",

    // Pricing tiers
    tiers: [
      {
        deposit: 10,
        signals: 10,
        label: '10 free signals monthly',
        bonus: 'Welcome bonus',
      },
      {
        deposit: 30,
        signals: 50,
        label: '50 free signals monthly',
        bonus: 'Priority support',
        recommended: false,
      },
      {
        deposit: 150,
        signals: 'unlimited',
        label: 'Unlimited signals + VIP',
        bonus: 'VIP analyst access',
        recommended: true,
      },
    ],

    // Call to action
    ctaText: 'Open Broker Account',
    ctaSecondary: 'I Already Have an Account',

    // Verification
    verificationNote: '⚠️ Account verification takes 5-30 minutes',

    // Legal
    riskDisclosure: 'Risk disclosure applies. Trading involves substantial risk.',
  },

  // ============================================================================
  // BROKER PROMOTION BANNER (Optional - Soft Promotion)
  // ============================================================================
  brokerPromotion: {
    enabled: false, // Set to false to disable soft promotion

    // Trigger settings
    minSignalsAfterEmail: 6, // Show after 6 signals with email
    minSignalConfidence: 85, // OR show on signals >85% confidence
    showOnProfitableSignal: true, // OR show on profitable signals
    frequencyMinutes: 3, // Show every 3 minutes if conditions met

    // UI content
    message: '🎁 Ready to trade? Open broker account → Get $150 bonus',
    ctaText: 'Claim Bonus →',
    dismissible: true, // User can close it
    blocking: false, // Does not block content
  },

  // ============================================================================
  // TIMING
  // ============================================================================
  timing: {
    sessionExpiry: 86400000, // 24 hours in milliseconds
    storageKey: 'gate_flow_state',
  },

  // ============================================================================
  // VALIDATION
  // ============================================================================
  validation: {
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    minNameLength: 2,
    maxNameLength: 50,
  },
} as const;

// Export individual configs for convenience
export const emailGateConfig = GATE_CONFIG.emailGate;
export const brokerGateConfig = GATE_CONFIG.brokerGate;
export const brokerPromotionConfig = GATE_CONFIG.brokerPromotion;

export default GATE_CONFIG;
