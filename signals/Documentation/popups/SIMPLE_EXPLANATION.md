# Gate System - Super Simple Explanation

## What You Need to Know

**There are 2 gates that block users:**

1. **Email Gate** - Appears after viewing 3 signals
2. **Broker Gate** - Appears after viewing 9 signals (total)

## How It Works in Real Life

### Step 1: User browses homepage
```
User sees: List of trading signals
User is: Anonymous (no email, no broker account)
Free drills remaining: 3
```

### Step 2: User clicks on Signal #1
```
✅ Signal details shown
Counter: 1 drill viewed
Free drills remaining: 2
```

### Step 3: User clicks on Signal #2
```
✅ Signal details shown
Counter: 2 drills viewed
Free drills remaining: 1
```

### Step 4: User clicks on Signal #3
```
✅ Signal details shown
Counter: 3 drills viewed
Free drills remaining: 0
⚠️ WARNING: Next signal will show EMAIL GATE
```

### Step 5: User clicks on Signal #4
```
🚪 EMAIL GATE POPUP APPEARS!

The popup says:
"Unlock Unlimited Signals"
"Enter your email to continue"

User MUST enter email to continue
User CANNOT close popup
User CANNOT see signal #4 details
```

### Step 6: User enters email and submits
```
✅ Email saved
✅ Popup closes
✅ Signal #4 details now visible
✅ User upgraded to "Email User"
Free drills remaining: 5 more (signals 5-9)
```

### Step 7: User views signals 5-9
```
✅ All FREE - no popups
Counter: 9 drills total viewed
⚠️ WARNING: Next signal will show BROKER GATE
```

### Step 8: User clicks on Signal #10
```
🚪 BROKER GATE POPUP APPEARS!

The popup says:
"Upgrade to Premium Access"
"Open a broker account for unlimited signals"

Shows pricing:
💰 $10 deposit → 10 signals/month
💰 $30 deposit → 50 signals/month
💰 $150 deposit → Unlimited signals ⭐

User MUST click "Open Broker Account"
OR click "I Already Have Account"
User CANNOT close popup
User CANNOT see signal #10 details
```

### Step 9: User opens broker account
```
✅ New tab opens with broker signup link
✅ User signs up (tracked with clickid)
✅ User upgraded to "Broker User"
✅ UNLIMITED access to all signals forever
```

## The Test Page (http://localhost:5001/en/gate-test)

### What It Does:
- **Simulates** the signal viewing experience
- **Shows** real-time counters
- **Displays** which gate will appear next
- **Tracks** user stage (anonymous → email → broker)

### How to Use It:

1. **Open in browser:**
   ```
   http://localhost:5001/en/gate-test
   ```

2. **Look at the top 3 cards:**
   - **Left card** = User Stage (anonymous/email_user/broker_user)
   - **Middle card** = Drills Viewed (0, 1, 2, 3...)
   - **Right card** = Remaining Free Drills (3, 2, 1, 0...)

3. **Click "Simulate Drill" button:**
   - Each click = viewing 1 signal
   - Counter goes up: 0 → 1 → 2 → 3
   - At drill #4, email gate appears!

4. **Watch the Activity Log:**
   - Shows every action in real-time
   - Shows when gates trigger
   - Shows state changes

5. **Try Quick Actions:**
   - "Jump to Email Gate" - skips to drill 4
   - "Jump to Broker Gate" - skips to drill 10
   - "Reset All" - starts over

6. **Use Auto Test:**
   - Click "🤖 Auto Test" button
   - Watches the entire flow automatically
   - Takes 15 seconds to complete

## File Locations

### Core Logic:
- `/src/mechanisms/gateFlowMechanism.ts` - Pure logic (when gates appear)
- `/src/config/gates.ts` - Configuration (text, pricing, thresholds)
- `/src/utils/gateState.ts` - State management (localStorage)

### React Integration:
- `/src/hooks/useGateFlow.ts` - React hook
- `/src/components/shared/gates/GateManager.tsx` - Displays gates
- `/src/components/shared/gates/EmailGateModal.tsx` - Email popup
- `/src/components/shared/gates/BrokerGateModal.tsx` - Broker popup

### Test Page:
- `/src/app/[locale]/gate-test/page.tsx` - Testing interface

### Tests:
- `/tests/e2e/gate-flow.spec.ts` - Automated tests (15+ scenarios)

## Key Numbers

```
FREE DRILLS (Anonymous):    3 signals
FREE DRILLS (Email User):   9 signals total (3 + 6 more)
FREE DRILLS (Broker User):  ∞ unlimited

EMAIL GATE TRIGGER:         After viewing 3 signals (appears on 4th)
BROKER GATE TRIGGER:        After viewing 9 signals (appears on 10th)
```

## What Gets Saved

In browser localStorage (`gate_flow_state`):

```json
{
  "hasEmail": false,
  "hasBrokerAccount": false,
  "drillsViewed": 0,
  "drillsViewedAfterEmail": 0,
  "sessionStart": 1696348800000,
  "emailProvidedAt": null,
  "brokerVerifiedAt": null,
  "brokerClickId": null,
  "lastBannerShown": null,
  "bannerDismissCount": 0,
  "drillHistory": []
}
```

After user provides email:

```json
{
  "hasEmail": true,          ← Changed
  "hasBrokerAccount": false,
  "drillsViewed": 4,         ← Updated
  "drillsViewedAfterEmail": 1, ← Started counting
  "sessionStart": 1696348800000,
  "emailProvidedAt": 1696349000000, ← Set
  "brokerVerifiedAt": null,
  "brokerClickId": null,
  "drillHistory": [          ← Tracks all viewed signals
    {"signalId": 1, "timestamp": 1696348850000, "beforeEmail": true},
    {"signalId": 2, "timestamp": 1696348900000, "beforeEmail": true},
    {"signalId": 3, "timestamp": 1696348950000, "beforeEmail": true},
    {"signalId": 4, "timestamp": 1696349000000, "beforeEmail": false}
  ]
}
```

## Common Questions

**Q: Why doesn't the counter increase when I click?**
A: Make sure you're clicking different signal IDs. Viewing signal #1 three times = still 1 drill.

**Q: Can users bypass the gates?**
A: No! They are HARD GATES. User must provide email/broker to continue.

**Q: What if user clears browser data?**
A: They go back to Anonymous. Have to provide email again.

**Q: How do we know if user really opened broker account?**
A: Broker sends "postback" to our server when user signs up. (To be implemented later)

**Q: Can I change when gates appear?**
A: Yes! Edit `/src/config/gates.ts`:
```typescript
emailGate: {
  triggerAfterDrills: 3,  // Change to 5 for 6th drill
},
brokerGate: {
  triggerAfterEmailDrills: 6,  // Change to 10 for 14th drill
}
```

## Summary

**3 user stages:**
1. Anonymous (3 free drills)
2. Email User (9 free drills total)
3. Broker User (unlimited)

**2 blocking gates:**
1. Email (at drill #4)
2. Broker (at drill #10)

**Test page shows:**
- Real-time counters
- User stage
- When gates will appear
- Activity log

**Real implementation:**
- Will be integrated into actual signal pages
- Same logic, but triggered when user clicks signal
- Gates appear when user tries to view drill-down details
