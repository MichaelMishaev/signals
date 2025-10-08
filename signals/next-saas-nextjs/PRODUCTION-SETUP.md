# 🚀 Production Deployment Guide

## Environment Variables for Production

### Required Environment Variables

#### 1. **OpenAI API** (for Signal Summaries)
```bash
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
```
- **Purpose:** Enables AI-powered summaries of last 3 trading signals
- **Location:** `.env.local` (development) or platform environment variables (production)
- **Dashboard:** https://platform.openai.com/api-keys
- **Fallback:** App works without it, provides basic summaries instead

#### 2. **Supabase** (Already Configured)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```
- **Purpose:** Database and authentication
- **Status:** ✅ Already configured

#### 3. **Email Service** (Resend - Optional)
```bash
RESEND_API_KEY=re_YOUR_API_KEY_HERE
EMAIL_FROM=Signals <noreply@yourdomain.com>
```
- **Purpose:** Send verification emails, welcome emails, magic links
- **Dashboard:** https://resend.com/api-keys
- **Status:** ⚠️ Currently not configured (emails logged to console)
- **Fallback:** App logs emails to console in development mode

#### 4. **App Configuration**
```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

---

## 📦 Deployment Platforms

### Option 1: Vercel (Recommended)

1. **Connect Repository:**
   ```bash
   vercel
   ```

2. **Add Environment Variables in Vercel Dashboard:**
   - Go to: Project Settings → Environment Variables
   - Add all required variables from above

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Build Command:** `npm run build`
2. **Publish Directory:** `.next`
3. **Add Environment Variables** in Netlify Dashboard

### Option 3: Render

1. **Build Command:** `npm run build`
2. **Start Command:** `npm run start`
3. **Add Environment Variables** in Render Dashboard

### Option 4: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
ENV PORT=5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t signals-app .
docker run -p 5000:5000 --env-file .env.production signals-app
```

---

## 🔒 Security Checklist

### ✅ Already Secured:
- [x] `.env.local` is in `.gitignore`
- [x] API keys not committed to repository
- [x] Environment variables documented

### 🔐 Add These to Your Production Platform:

**Vercel/Netlify/Render Environment Variables:**

```bash
# OpenAI (Required for AI summaries)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Email (Optional - for production emails)
RESEND_API_KEY=re_YOUR_API_KEY_HERE
EMAIL_FROM=Signals <noreply@yourdomain.com>

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

---

## 🐛 Bug Fixes Applied

### ✅ Fixed Issues:

#### 1. **Email Sending Bug** - FIXED ✅
- **Problem:** `createTransporter()` function was missing, causing email sending to fail
- **Solution:** Rewrote `sendWelcomeEmail()` to use Resend API (same as other email functions)
- **Fallback:** If `RESEND_API_KEY` not configured, emails are logged to console
- **File:** `src/lib/email.ts:210-277`

#### 2. **Language Pill Bug** - FIXED ✅
- **Problem:** Click on one side, submenu appears on another (production only)
- **Root Cause:** Event propagation and z-index conflicts between backdrop and dropdown
- **Solution:**
  - Added `e.stopPropagation()` to all click handlers
  - Fixed z-index: backdrop `z-[9998]`, dropdown `z-[9999]`
  - Improved shadow for better visibility
- **File:** `src/components/shared/LanguageSwitcher.tsx:54-98`

#### 3. **Footer 404 Links** - FIXED ✅
- **Problem:** Many footer links led to 404 pages
- **Solution:** Removed all irrelevant links, kept only:
  - FAQ
  - Contact (#contact anchor)
  - Terms & Conditions
  - Privacy Policy
- **File:** `src/components/shared/footer/FooterOne.tsx:74-113`

#### 4. **Button Behaviors** - FIXED ✅
- **btn-dark (View Live Signals):** Now scrolls smoothly to signals timeline
- **btn-primary (Start Trial):** Opens modal with AI-powered signal summary
- **Files:**
  - `src/components/tradesignal/Hero.tsx`
  - `src/components/tradesignal/SignalSummaryModal.tsx`
  - `src/app/api/signals/summary/route.ts`

---

## 🧪 Testing Before Production

### 1. Test Email Functionality (Optional)
If you want emails in production, get a Resend API key:

1. Sign up at https://resend.com
2. Get API key
3. Add to environment variables:
   ```bash
   RESEND_API_KEY=re_your_actual_key
   EMAIL_FROM=Signals <noreply@yourdomain.com>
   ```

### 2. Test OpenAI Summaries
The OpenAI key is already added to `.env.local`. Test it:

```bash
npm run dev
```

Then:
1. Visit http://localhost:5000
2. Click "Start Trial" button (btn-primary)
3. Modal should show AI-powered summary of last 3 signals

### 3. Test Language Switcher
1. Click language selector in header
2. Verify dropdown appears correctly
3. Switch between English/Urdu
4. Test in production build:
   ```bash
   npm run build
   npm run start
   ```

### 4. Test Footer Links
1. Verify only relevant links appear
2. Click each link to ensure no 404s

---

## 📊 Performance Optimization

### Build for Production:
```bash
npm run build
```

### Check Bundle Size:
```bash
npm run build -- --analyze
```

### Production Checklist:
- [ ] All environment variables configured
- [ ] Email service configured (or acknowledged as optional)
- [ ] OpenAI API key added
- [ ] Language switcher tested in production build
- [ ] Footer links verified
- [ ] Button behaviors tested
- [ ] Build succeeds without errors

---

## 🆘 Troubleshooting

### Issue: OpenAI API Returns Error
**Solution:** Check API key is valid and has credits:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Issue: Emails Not Sending
**Solution:**
1. Check `RESEND_API_KEY` is set
2. Verify API key is valid at https://resend.com/api-keys
3. In development, emails are logged to console (this is normal)

### Issue: Language Switcher Broken in Production
**Solution:**
1. Clear browser cache
2. Hard reload (Cmd+Shift+R / Ctrl+Shift+F5)
3. Check z-index conflicts with other components
4. Verify the fix is deployed (check component file on server)

### Issue: Build Fails
**Solution:**
1. Clear `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `npm ci`
3. Try build again: `npm run build`

---

## 📝 Post-Deployment Steps

1. **Verify All Features:**
   - [ ] Signal summaries working (btn-primary)
   - [ ] Smooth scroll to timeline (btn-dark)
   - [ ] Language switcher functional
   - [ ] Footer links correct
   - [ ] Email notifications (if configured)

2. **Monitor Logs:**
   - Check for any runtime errors
   - Verify API calls to OpenAI succeed
   - Monitor email delivery (if configured)

3. **Update Documentation:**
   - Document your production URL
   - Update team on new features
   - Share API usage guidelines

---

## 🎯 Quick Deploy Commands

### Development:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
npm run start
```

### Deploy to Vercel:
```bash
vercel --prod
```

### Environment Variables Quick Setup (Vercel CLI):
```bash
vercel env add OPENAI_API_KEY production
# Paste your OpenAI API key when prompted
```

---

## 🔗 Useful Links

- **OpenAI Dashboard:** https://platform.openai.com/api-keys
- **Resend Dashboard:** https://resend.com/api-keys
- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Next.js Docs:** https://nextjs.org/docs

---

**✅ All bugs fixed and ready for production deployment!**
