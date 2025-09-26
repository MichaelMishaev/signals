# 🚂 Railway + PostgreSQL Setup Guide

## ⚠️ **IMPORTANT: Railway Build Fix Applied**

I've added proper Node.js environment configuration:
- **`Dockerfile`** - Containerized deployment (recommended)
- **`nixpacks.toml`** - Railway's native buildpack system
- **`.railwayignore`** - Optimized file exclusions

Railway will auto-detect and use the Dockerfile for reliable deployment.

## 🎯 **Two Database Options**

### **Option A: Keep Supabase (Recommended - Easiest)**
✅ **Pros**: Already configured, free tier, includes auth/storage
❌ **Cons**: External dependency

### **Option B: Railway PostgreSQL (All-in-one)**
✅ **Pros**: Everything in Railway, simpler billing
❌ **Cons**: Need to migrate data, $5+/month

---

## 🚀 **Option A: Railway + Supabase (5 minutes)**

### 1. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `signals` repository
5. Railway auto-detects Next.js ✅

### 2. Set Environment Variables
In Railway dashboard, go to **Variables** tab and add:
```
NODE_ENV=production
PORT=5001
NEXT_PUBLIC_SUPABASE_URL=https://avxygvzqfyxpzdxwmefe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rtWhC7Pp5XzJCTFTTR6VzQ_FIYgdOTQ
SUPABASE_SERVICE_ROLE_KEY=sb_secret_Ci7ZL06_YdZFdoB9h3SmFg_cX3INlEp
```

### 3. Deploy
Click **Deploy** - Railway handles everything automatically! 🎉

**Total Cost**: ~$5/month (Railway hosting) + Free (Supabase)

---

## 🗄️ **Option B: Railway + PostgreSQL (10 minutes)**

### 1. Create PostgreSQL Database
1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway creates and configures the database

### 2. Connect Database to App
Railway auto-generates these variables:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
POSTGRES_HOST=${{Postgres.PGHOST}}
POSTGRES_USER=${{Postgres.PGUSER}}
POSTGRES_PASSWORD=${{Postgres.PGPASSWORD}}
POSTGRES_DATABASE=${{Postgres.PGDATABASE}}
POSTGRES_PORT=${{Postgres.PGPORT}}
```

### 3. Update Next.js Configuration
You'll need to replace Supabase with direct PostgreSQL queries:

```typescript
// Replace Supabase client with PostgreSQL
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
```

### 4. Migrate Database Schema
Run your SQL schema in Railway's PostgreSQL console.

**Total Cost**: ~$5/month (Railway) + ~$5/month (PostgreSQL) = $10/month

---

## 🎯 **Quick Recommendation**

**Start with Option A (Railway + Supabase)** because:
- ✅ **Fastest setup** - No code changes needed
- ✅ **Lowest cost** - Supabase free tier
- ✅ **Keep existing features** - Auth, storage, real-time
- ✅ **Easy migration later** if you want all-in-Railway

### Next Steps:
1. Go to [railway.app](https://railway.app) now
2. Connect your GitHub repo
3. Add environment variables
4. Deploy!

Your app should be live in under 10 minutes! 🚀