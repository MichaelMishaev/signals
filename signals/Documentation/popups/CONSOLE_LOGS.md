# Console Logs - Gate System

All gate system actions are now logged to the browser console with the `[GATE]` prefix.

## 📊 How to View Logs

1. Open browser DevTools (F12)
2. Go to "Console" tab
3. Type: `[GATE]` in the filter box
4. You'll see all gate-related logs

## 🎯 Log Types

### 1. Drill View Logs

**When user views a signal:**
```
[GATE] 📊 Drill view recorded {
  timestamp: "2025-10-04T12:34:56.789Z",
  signalId: 5,
  drillsViewed: 5,
  beforeEmail: false,
  currentStage: "email_user"
}
```

**When user views same signal twice:**
```
[GATE] ⏭️ Drill view skipped (duplicate) {
  signalId: 3,
  drillsViewed: 5
}
```

### 2. Gate Trigger Logs

**When Email Gate appears:**
```
[GATE] 🚪 EMAIL GATE TRIGGERED {
  timestamp: "2025-10-04T12:34:56.789Z",
  drillNumber: 4,
  drillsViewed: 3,
  currentStage: "anonymous",
  reason: "Exceeded max drills for anonymous user"
}
```

**When Broker Gate appears:**
```
[GATE] 🚪 BROKER GATE TRIGGERED {
  timestamp: "2025-10-04T12:35:56.789Z",
  drillNumber: 10,
  drillsViewed: 9,
  currentStage: "email_user",
  reason: "Exceeded max drills for email user"
}
```

### 3. Email Submission Logs

**When user provides email:**
```
[GATE] ✉️ EMAIL GATE - Email submitted {
  timestamp: "2025-10-04T12:34:58.789Z",
  email: "user@example.com",
  drillsViewedBefore: 3,
  transition: "anonymous → email_user"
}
```

### 4. Broker Action Logs

**When user clicks "Open Broker Account":**
```
[GATE] 🔗 Broker link clicked {
  timestamp: "2025-10-04T12:36:10.789Z",
  clickId: "1696348970123_abc123def",
  brokerUrl: "https://broker-signup-url.com"
}
```

**When broker account is verified:**
```
[GATE] 💎 BROKER GATE - Broker account verified {
  timestamp: "2025-10-04T12:36:15.789Z",
  drillsViewedBefore: 10,
  drillsAfterEmail: 6,
  transition: "email_user → broker_user"
}
```

### 5. Banner Logs (if enabled)

**When broker promotion banner shows:**
```
[GATE] 🎁 Broker Promotion Banner SHOWN {
  timestamp: "2025-10-04T12:35:00.789Z",
  drillsViewedAfterEmail: 6,
  lastShown: "never"
}
```

**When user dismisses banner:**
```
[GATE] ❌ Broker Promotion Banner DISMISSED {
  timestamp: "2025-10-04T12:35:05.789Z",
  totalDismissals: 1
}
```

## 📝 Example Console Output

Complete user journey from anonymous to broker user:

```
[GATE] 📊 Drill view recorded { signalId: 1, drillsViewed: 1, currentStage: "anonymous" }
[GATE] 📊 Drill view recorded { signalId: 2, drillsViewed: 2, currentStage: "anonymous" }
[GATE] 📊 Drill view recorded { signalId: 3, drillsViewed: 3, currentStage: "anonymous" }

[GATE] 🚪 EMAIL GATE TRIGGERED { drillNumber: 4, reason: "Exceeded max drills for anonymous user" }
[GATE] ✉️ EMAIL GATE - Email submitted { email: "user@example.com", transition: "anonymous → email_user" }

[GATE] 📊 Drill view recorded { signalId: 4, drillsViewed: 4, currentStage: "email_user" }
[GATE] 📊 Drill view recorded { signalId: 5, drillsViewed: 5, currentStage: "email_user" }
[GATE] 📊 Drill view recorded { signalId: 6, drillsViewed: 6, currentStage: "email_user" }
[GATE] 📊 Drill view recorded { signalId: 7, drillsViewed: 7, currentStage: "email_user" }
[GATE] 📊 Drill view recorded { signalId: 8, drillsViewed: 8, currentStage: "email_user" }
[GATE] 📊 Drill view recorded { signalId: 9, drillsViewed: 9, currentStage: "email_user" }

[GATE] 🚪 BROKER GATE TRIGGERED { drillNumber: 10, reason: "Exceeded max drills for email user" }
[GATE] 🔗 Broker link clicked { clickId: "1696348970123_abc123def" }
[GATE] 💎 BROKER GATE - Broker account verified { transition: "email_user → broker_user" }

[GATE] 📊 Drill view recorded { signalId: 10, drillsViewed: 10, currentStage: "broker_user" }
[GATE] 📊 Drill view recorded { signalId: 11, drillsViewed: 11, currentStage: "broker_user" }
... unlimited access ...
```

## 🔍 Filtering Logs

### See only gate triggers:
```
[GATE] 🚪
```

### See only drill views:
```
[GATE] 📊
```

### See only email-related:
```
[GATE] ✉️
```

### See only broker-related:
```
[GATE] 💎
```

### See only banner-related:
```
[GATE] 🎁
```

## 🐛 Debugging Tips

### Problem: Gates not appearing

**Check these logs:**
1. Are drill views being recorded?
   - Look for `[GATE] 📊 Drill view recorded`
2. Is gate trigger logic being called?
   - Look for `[GATE] 🚪 GATE TRIGGERED`
3. What's the current stage?
   - Check `currentStage` in logs

### Problem: Duplicate drill counts

**Check these logs:**
1. Look for `[GATE] ⏭️ Drill view skipped (duplicate)`
2. Check if same `signalId` is being passed multiple times

### Problem: Banner appearing too often

**Check these logs:**
1. Look for `[GATE] 🎁 Broker Promotion Banner SHOWN`
2. Check `lastShown` timestamp
3. Verify `frequencyMinutes` in config
4. Banner is currently **DISABLED** in `/src/config/gates.ts`

## 📊 Analytics Integration

You can hook into these console logs for analytics:

```javascript
// Intercept console.log
const originalLog = console.log;
console.log = function(...args) {
  if (args[0] && typeof args[0] === 'string' && args[0].startsWith('[GATE]')) {
    // Send to analytics
    analytics.track(args[0], args[1]);
  }
  originalLog.apply(console, args);
};
```

## 🎯 Summary

**All gate actions are logged:**
- ✅ Drill views (with duplicate detection)
- ✅ Email gate triggers
- ✅ Broker gate triggers
- ✅ Email submissions
- ✅ Broker clicks
- ✅ Broker verifications
- ✅ Banner shows/dismissals

**Log format:**
- Prefix: `[GATE]`
- Icon: Visual identifier (📊, 🚪, ✉️, 💎, 🎁)
- Data: Structured object with timestamp and context

**Location:**
- All logs in browser console
- Filter by `[GATE]` to see only gate-related logs
