# ⚠️ PORT CORRECTION - Use 5001, Not 5000!

**Issue:** Documentation incorrectly referenced port 5000
**Correct Port:** **5001** ✅

---

## ✅ CORRECT URLS

**Your dev server runs on port 5001:**

```bash
# Correct URLs:
http://localhost:5001/en/signal/4  ✅
http://localhost:5001/en/signal/6  ✅
http://localhost:5001/en/signal/7  ✅
http://localhost:5001/changelog    ✅

# Wrong URLs (ignore these):
http://localhost:5000/...  ❌
```

---

## 🔧 WHY PORT 5001?

**From your `package.json`:**
```json
"scripts": {
  "dev": "next dev --turbopack -p 5001"  ← Port 5001 specified
}
```

**Playwright config also uses 5001:**
```typescript
// playwright.config.ts
baseURL: 'http://localhost:5001'
webServer: {
  command: 'npx next dev --turbopack -p 5001'
}
```

---

## ✅ CORRECTED STEP 1 TEST

**Use this URL:**

```bash
# 1. Open browser to the CORRECT port:
http://localhost:5001/en/signal/4  ✅ CORRECT

# 2. Open DevTools (F12) → Application → Clear site data

# 3. Refresh → Modal appears

# 4. Press ESC

# 5. Count to 10: 1...2...3...4...5...6...7...8...9...10...

# ✅ SUCCESS = Modal stays closed
# ❌ FAIL = Modal reopens
```

---

## 📝 CORRECTED VERIFICATION SCRIPT

**Use in DevTools Console on port 5001:**

```javascript
// Verify you're on correct port:
console.log('Current URL:', window.location.href);
// Should show: http://localhost:5001/...

// Check localStorage after closing modal:
const dismissalKey = localStorage.getItem('email-modal-dismissed-until');
if (dismissalKey) {
  const timestamp = parseInt(dismissalKey);
  const hours = (timestamp - Date.now()) / (1000 * 60 * 60);
  console.log(`✅ Modal dismissed for ${hours.toFixed(1)} hours`);
} else {
  console.log('❌ No dismissal key found - close modal first');
}
```

---

## 🎯 QUICK REFERENCE

| Item | Correct Value |
|------|---------------|
| **Dev Port** | 5001 ✅ |
| **Test URL** | http://localhost:5001/en/signal/4 ✅ |
| **Playwright** | Uses port 5001 ✅ |
| **Wrong Port** | ~~5000~~ ❌ |

---

## 🚀 TO START DEV SERVER

```bash
# Starts on port 5001 automatically:
npm run dev

# Server will show:
# ✓ Ready on http://localhost:5001
```

---

## ✅ CORRECTED STEP 1 VERIFICATION

**The 30-second test with CORRECT port:**

1. Visit: **http://localhost:5001/en/signal/4** ✅
2. Clear localStorage (DevTools → Application → Clear site data)
3. Refresh page → Modal appears
4. Press **ESC** key
5. Wait 10 seconds → Modal should stay closed
6. ✅ SUCCESS = No modal
7. ❌ FAIL = Modal reopens

---

## 📊 SERVER STATUS CHECK

```bash
# Check if server is running on correct port:
curl -s http://localhost:5001/en/signal/4 > /dev/null && \
  echo "✅ Server running on port 5001" || \
  echo "❌ Server not running"
```

---

## 💡 KEY TAKEAWAY

**Always use port 5001:**
- ✅ http://localhost:**5001**/en/signal/4
- ❌ ~~http://localhost:5000/en/signal/4~~

All test files (Playwright) are correctly configured for port 5001.
The documentation had incorrect references - use **5001** everywhere!

---

**Updated:** October 7, 2025
**Issue:** Documentation error (referenced wrong port)
**Resolution:** Always use port **5001** ✅
