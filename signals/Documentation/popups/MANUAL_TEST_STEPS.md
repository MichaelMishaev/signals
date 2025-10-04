# Manual Testing Steps - Gate System

## 🧪 How to Test Manually

### Option 1: Using the Test Page (Easiest)

1. **Open test page in browser:**
   ```
   http://localhost:5001/en/gate-test
   ```

2. **Look at the dashboard:**
   - Top left shows: "ANONYMOUS" (user type)
   - Top middle shows: "0" (drills viewed)
   - Top right shows: "3" (drills remaining)

3. **Scroll down to "Quick Actions" section**

4. **Click the "Simulate Drill" button once**
   - Watch the "Activity Log" - you'll see: "Drill #1 viewed"
   - But counter might not update due to hook timing

5. **Better approach: Click "🤖 Auto Test" button**
   - This runs the entire flow automatically
   - Watch the activity log
   - You'll see gates appear in real-time

### Option 2: Test with Actual Integration (When Ready)

1. **Go to homepage:**
   ```
   http://localhost:5001
   ```

2. **Click on any signal card to view details**
   - Counter increments
   - After 3 clicks, email gate appears

3. **Provide email in popup**
   - Gate closes
   - Can view 6 more signals

4. **After 9 total signals**
   - Broker gate appears
   - Must open broker account

## 🔍 What to Check

### Email Gate Test:
- [ ] Appears after viewing 3 signals
- [ ] Cannot be dismissed
- [ ] Email validation works
- [ ] After submit, can view more signals
- [ ] State persists after page reload

### Broker Gate Test:
- [ ] Appears after viewing 9 signals (total)
- [ ] Cannot be dismissed
- [ ] Shows pricing tiers
- [ ] "Open Broker Account" opens new tab
- [ ] State persists after page reload

## 🐛 If Something Doesn't Work

### Test Page Counter Doesn't Update:
- This is a known timing issue with React state
- Use the "Auto Test" button instead
- Or check the localStorage directly in browser devtools

### Gates Don't Appear:
- Check browser console for errors
- Check if files exist:
  - `/src/components/shared/gates/EmailGateModal.tsx`
  - `/src/components/shared/gates/BrokerGateModal.tsx`
  - `/src/hooks/useGateFlow.ts`

### Check localStorage:
1. Open browser DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage" → "http://localhost:5001"
4. Find key: `gate_flow_state`
5. See the JSON data

## 📸 Screenshots

Playwright test created these screenshots in `/test-results/`:
- `demo-1-start.png` - Initial state
- `demo-4-email-gate.png` - Email gate popup (if it appeared)
- `demo-7-broker-gate.png` - Broker gate popup (if it appeared)

Check these files to see what the gates look like!

## ✅ Quick Verification

Run this command to verify files exist:
```bash
ls -la src/components/shared/gates/
ls -la src/hooks/useGateFlow.ts
ls -la src/utils/gateState.ts
ls -la src/config/gates.ts
```

All files should exist!
