# Signal Access & Gate Logic - Complete Guide

## Overview

We use a **two-gate system** to convert visitors into engaged users and then into broker account holders:

1. **Email Gate** - Captures user email after 3 free signal views
2. **Broker Gate** - Requires broker account after 9 total signal views (6 after email)

All gates are configured in `/src/config/gates.ts`

**Architecture:**
- Core logic: `/src/mechanisms/gateFlowMechanism.ts` (pure functions)
- Configuration: `/src/config/gates.ts`
- State management: `/src/utils/gateState.ts`
- React integration: `/src/hooks/useGateFlow.ts`
- UI components: `/src/components/shared/gates/`

---

## 🎯 The Two Gates Explained

### Gate 1: **Email Gate** - "Unlock Unlimited Signals"

**When does it show?**
- After user views **3 signal drill-downs** (detail pages)
- Triggers on the **4th drill-down attempt**

**What does it require?**
- User email address (no credit card, no payment)

**What does it unlock?**
- Access to 6 more signal drill-downs (signals 4-9)
- Full signal details: entry price, stop loss, take profit
- Complete technical analysis and charts

**How often?**
- Shows **ONCE per session**
- Cannot be dismissed without providing email
- Blocking modal (user must provide email to continue)

**Example:**
```
Visitor clicks Signal #1 → ✅ Views full details (FREE)
Visitor clicks Signal #2 → ✅ Views full details (FREE)
Visitor clicks Signal #3 → ✅ Views full details (FREE)
Visitor clicks Signal #4 → 🚪 EMAIL GATE appears!
  → User enters: john@example.com
  → Gate disappears, can now view signals 4-9
```

---

### Gate 2: **Broker Gate** - "Upgrade to Premium Access"

**When does it show?**
- After user views **9 signal drill-downs total**
  - 3 drills before email gate
  - 6 drills after email gate
- Triggers on the **10th drill-down attempt**

**What does it require?**
- Verified broker account signup
- Deposit (minimum $10) to activate account

**What does it unlock?**
- **Unlimited** signal drill-down access
- No more gates or limits
- VIP features (for $150+ deposits)

**Deposit Tiers:**
- **$10 deposit** → 10 signals per month + bonus
- **$30 deposit** → 50 signals per month + bonus
- **$150 deposit** → Unlimited signals + VIP support

**How often?**
- Shows **ONCE** when limit is reached
- Cannot be dismissed (blocking modal)
- User must open broker account OR cannot view more signals

**Verification:**
- Broker sends verification to our system (postback)
- Verification takes 5-30 minutes
- Gate automatically disappears once verified

**Example:**
```
User with email views Signal #5 → ✅ FREE (1st after email)
User views Signal #6 → ✅ FREE (2nd after email)
User views Signal #7 → ✅ FREE (3rd after email)
User views Signal #8 → ✅ FREE (4th after email)
User views Signal #9 → ✅ FREE (5th after email)
User views Signal #10 → 🚪 BROKER GATE appears!
  → User clicks "Open Broker Account"
  → Goes to broker site, completes signup
  → Returns to our site after 15 minutes
  → Gate disappears, unlimited access granted ✅
```

---

## 📊 Complete User Journey

### Stage 1: Anonymous Visitor (No Email)

**What they can do:**
- ✅ Browse signal list (homepage)
- ✅ View 3 signal drill-downs (full details)
- ✅ See entry/stop/take profit on first 3 signals

**What they CANNOT do:**
- ❌ View 4th signal without email
- ❌ Access broker bonuses

**Journey:**
```
0:00 - Lands on homepage, sees signal list
0:02 - Clicks "EUR/USD Bullish" → Views full signal (Drill 1)
0:05 - Clicks "GBP/USD Rally" → Views full signal (Drill 2)
0:08 - Clicks "Gold Breakout" → Views full signal (Drill 3)
0:11 - Clicks "BTC Signal" → 🚪 EMAIL GATE blocks access
```

---

### Stage 2: Email Subscriber (Has Email, No Broker)

**What they can do:**
- ✅ Browse signal list (homepage)
- ✅ View 6 MORE signal drill-downs (drills 4-9)
- ✅ Full access to technical analysis

**What they CANNOT do:**
- ❌ View 10th+ signal without broker account

**Journey:**
```
0:11 - Provides email: john@example.com
0:12 - Views Signal #4 (BTC) → ✅ Full access
0:15 - Views Signal #5 (ETH) → ✅ Full access
0:18 - Views Signal #6 (EUR/JPY) → ✅ Full access
0:21 - Views Signal #7 (AUD/USD) → ✅ Full access
0:24 - Views Signal #8 (CAD) → ✅ Full access
0:27 - Views Signal #9 (NZD) → ✅ Full access
0:30 - Tries Signal #10 → 🚪 BROKER GATE blocks access
```

---

### Stage 3: Broker Account Holder (Full Access)

**What they can do:**
- ✅ Browse signal list (unlimited)
- ✅ View ALL signal drill-downs (unlimited)
- ✅ Access all premium features
- ✅ VIP support (if $150+ deposit)

**What they CANNOT do:**
- Nothing! Full access to everything

**Journey:**
```
0:30 - Clicks "Open Broker Account"
0:31 - New tab opens to broker.com/signup
0:45 - Completes broker registration form
0:50 - Verifies identity (KYC)
0:55 - Makes $30 deposit
1:00 - Broker verifies account, sends confirmation
1:00 - Returns to our site, refreshes page
1:01 - 🎉 BROKER GATE disappears!
1:02 - Views Signal #10 → ✅ Full access (no gate)
1:05 - Views Signal #11, #12, #13... → ✅ All FREE now
```

---

## 🔄 Gate Triggering Logic

### Email Gate Logic:

```javascript
// Check if email gate should appear
function shouldShowEmailGate(user) {
  const drillsViewed = user.drillHistory.length;

  return (
    !user.hasEmail &&           // User hasn't provided email
    drillsViewed >= 3           // User has viewed 3 drills
  );
}

// Trigger on 4th drill attempt
if (shouldShowEmailGate(user) && attemptingDrill === 4) {
  showEmailGate();
}
```

### Broker Gate Logic:

```javascript
// Check if broker gate should appear
function shouldShowBrokerGate(user) {
  const drillsAfterEmail = user.drillHistory.filter(
    drill => drill.timestamp > user.emailProvidedAt
  ).length;

  return (
    user.hasEmail &&                    // User has provided email
    !user.hasBrokerAccount &&           // User hasn't opened broker
    drillsAfterEmail >= 6               // User viewed 6 drills after email
  );
}

// Trigger on 10th drill attempt (6th after email)
if (shouldShowBrokerGate(user) && drillsAfterEmail === 6) {
  showBrokerGate();
}
```

---

## 📈 Signal Counting Rules

### What Counts as a "Signal View"?

✅ **COUNTS:**
- Clicking a signal from homepage → viewing drill-down page
- Viewing full signal details (entry, stop, take profit)
- Viewing signal analysis, charts, technical levels

❌ **DOES NOT COUNT:**
- Browsing signal list on homepage
- Hovering over signal cards
- Refreshing the same signal page
- Clicking "Back" button

### Counting Examples:

**Scenario 1: Fresh Visitor**
```
Homepage → Signal #1 (count: 1)
Homepage → Signal #2 (count: 2)
Homepage → Signal #3 (count: 3)
Homepage → Signal #4 (EMAIL GATE)
```

**Scenario 2: After Email Provided**
```
Counter RESETS when email provided
Signal #5 (count: 1 after email)
Signal #6 (count: 2 after email)
Signal #7 (count: 3 after email)
Signal #8 (count: 4 after email)
Signal #9 (count: 5 after email)
Signal #10 (count: 6 after email) → BROKER GATE
```

**Scenario 3: Refresh/Revisit**
```
User views Signal #1, then refreshes page
→ Still count: 1 (no double-counting)

User views Signal #1, leaves site, returns tomorrow
→ Count persists in localStorage
→ Still count: 1
```

---

## 🔧 Broker Promotion Banner (Optional)

**Note:** This is SEPARATE from the Broker Gate and appears BEFORE the gate.

**When does it show?**
Shows a non-blocking promotional banner when:
- ✅ User has email
- ✅ User does NOT have broker
- ✅ User meets ANY trigger:
  - Viewed 6+ signals after email
  - OR viewing signal with confidence >85%
  - OR viewing profitable signal
- ✅ Last shown 3+ minutes ago

**What does it do?**
- Displays dismissible banner at top of signal page
- Promotes broker deposit bonuses
- User can dismiss and continue viewing signals
- Does NOT block access (unlike Broker Gate)

**How is it different from Broker Gate?**

| Feature | Broker Promotion Banner | Broker Gate |
|---------|------------------------|-------------|
| Type | Soft promotion | Hard gate |
| Blocking | No (dismissible) | Yes (must act) |
| Trigger | 6+ drills after email | 10th drill attempt |
| Frequency | Every 3 minutes | Once only |
| User can dismiss | Yes | No |

---

## ⚙️ Configuration

All settings are in `/src/config/popups.ts`:

```javascript
export const POPUP_CONFIG = {
  // Broker URL (all gates link here)
  brokerUrl: 'https://broker-signup-url.com',

  // Gate triggers
  gates: {
    emailGate: {
      triggerAfterDrills: 3,  // Show on 4th drill
      required: true,
      blocking: true
    },

    brokerGate: {
      triggerAfterEmailDrills: 6,  // Show on 10th drill (6th after email)
      required: true,
      blocking: true
    }
  },

  // Pricing tiers shown in Broker Gate
  pricing: {
    basic: {
      price: 10,
      signals: 10,
      label: '10 free signals monthly'
    },
    standard: {
      price: 30,
      signals: 50,
      label: '50 free signals monthly'
    },
    premium: {
      price: 150,
      signals: 'unlimited',
      label: 'unlimited signals monthly'
    }
  },

  // Broker Promotion Banner (optional)
  promotion: {
    minSignalsAfterEmail: 6,
    minSignalConfidence: 85,
    frequencyMinutes: 3
  }
};
```

---

## 🗂️ Data Storage

### localStorage Schema:

```javascript
{
  // Email Gate Data
  hasEmail: false,
  userEmail: null,
  emailProvidedAt: null,

  // Broker Gate Data
  hasBrokerAccount: false,
  brokerVerifiedAt: null,
  brokerClickId: null,

  // Drill View History
  drillHistory: [
    {
      signalId: 123,
      timestamp: 1234567890,
      beforeEmail: true  // Was this before email gate?
    }
  ],

  // Promotion Banner
  lastBannerShown: null,
  bannerDismissCount: 0
}
```

---

## 🎯 Summary Table

| Stage | Drills Allowed | Gate Type | Requirement |
|-------|---------------|-----------|-------------|
| **Anonymous** | 3 free drills | None | None |
| **Email Gate** | Blocks 4th drill | Hard (blocking) | Email address |
| **Email User** | 6 more drills (4-9) | None | Email provided |
| **Broker Gate** | Blocks 10th drill | Hard (blocking) | Broker account + deposit |
| **Full Access** | Unlimited drills | None | Broker verified |

---

## 📝 Important Notes

**Email Gate:**
- Hard requirement (cannot be dismissed)
- Shows blocking modal
- User must provide email to continue
- No payment required

**Broker Gate:**
- Hard requirement (cannot be dismissed)
- Shows blocking modal with pricing tiers
- User must open broker account to continue
- Requires minimum $10 deposit
- Verification takes 5-30 minutes (automatic via postback)

**Broker Verification (Coming Soon):**
- Server-to-server postback from broker
- Real-time verification when account approved
- Automatic access unlock when verified
- Manual verification option if postback fails

**Session Persistence:**
- All counts stored in localStorage
- Survives page refresh
- Persists across visits (until cleared)
- Session expires after 24 hours (configurable)

---

## 🚀 Future Enhancements

**Planned Features:**
- [ ] Manual broker verification via confirmation code
- [ ] Email verification option for existing broker users
- [ ] Tiered access based on deposit amount
- [ ] Analytics tracking for gate conversion rates
- [ ] A/B testing for gate triggers (3 vs 5 free signals)
- [ ] Grace period for verification delays

---

*Last Updated: [Current Date]*
*Version: 2.0 - Two-Gate System*
