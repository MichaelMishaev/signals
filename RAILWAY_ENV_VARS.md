# 🔧 Railway Environment Variables Setup

## 🚀 **How to Add Environment Variables in Railway**

1. Go to your Railway project dashboard
2. Click on your service/deployment
3. Go to the **"Variables"** tab
4. Click **"New Variable"** for each one below

## 📋 **Required Environment Variables**

### **Essential Variables (Copy these exactly):**

```
NODE_ENV=production
```

```
NEXT_PUBLIC_SITE_URL=https://signals-nextjs-production.up.railway.app
```

```
NEXT_PUBLIC_SUPABASE_URL=https://avxygvzqfyxpzdxwmefe.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rtWhC7Pp5XzJCTFTTR6VzQ_FIYgdOTQ
```

```
SUPABASE_SERVICE_ROLE_KEY=sb_secret_Ci7ZL06_YdZFdoB9h3SmFg_cX3INlEp
```

### **Optional Variables (Railway may auto-set):**

```
PORT=3000
```
*Railway typically sets this automatically*

## ⚠️ **Important Notes**

- **Copy exactly**: Don't modify the URLs or keys
- **One variable at a time**: Add each as a separate environment variable
- **Case sensitive**: Make sure capitalization matches exactly
- **No quotes**: Don't wrap values in quotes in Railway dashboard

## ✅ **After Adding Variables**

1. **Save** each variable
2. **Redeploy** if Railway doesn't automatically redeploy
3. Your Next.js app will have access to Supabase

## 🔍 **What Each Variable Does**

- **`NODE_ENV`**: Tells Next.js to run in production mode
- **`NEXT_PUBLIC_SITE_URL`**: Your Railway deployment URL (needed for API routes)
- **`NEXT_PUBLIC_SUPABASE_URL`**: Your Supabase project URL (public)
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Public API key for client-side access
- **`SUPABASE_SERVICE_ROLE_KEY`**: Server-side API key for admin operations

These are the same variables you had in your `.env.local` file locally!