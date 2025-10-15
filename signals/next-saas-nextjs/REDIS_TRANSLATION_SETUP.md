# Redis Translation Cache Setup Guide

## Overview

This guide explains how to set up **Redis-based persistent translation caching** for Urdu news translations, dramatically reducing OpenAI API costs while improving performance.

## Why Redis for Translation Caching?

### Problem with In-Memory Caching
- ❌ Lost on server restart
- ❌ Not shared between instances
- ❌ Re-translates same content multiple times
- ❌ Wastes OpenAI API credits

### Solution: Redis Translation Cache
- ✅ Persistent across restarts
- ✅ Shared between all instances
- ✅ Only translates each article ONCE
- ✅ 30-day TTL (auto-cleanup)
- ✅ LRU-style (extends TTL on access)
- ✅ **Saves 95%+ on OpenAI costs**

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Translation Flow                       │
└─────────────────────────────────────────────────────────┘

Request for Urdu news
  │
  ├──> Check Redis Cache
  │      │
  │      ├──> HIT ✅ → Return cached translation (FREE)
  │      │
  │      └──> MISS ❌
  │             │
  │             ├──> Check In-Memory Cache
  │             │      │
  │             │      ├──> HIT ✅ → Return + Store in Redis
  │             │      │
  │             │      └──> MISS ❌
  │             │             │
  │             │             ├──> Call OpenAI API ($$$)
  │             │             │
  │             │             ├──> Cache in Redis (30 days)
  │             │             │
  │             │             └──> Cache in Memory (6 hours)
  │             │
  │             └──> Return translation
  │
  └──> Display to user
```

## Cost Comparison

### Without Redis (In-Memory Only)
```
Scenario: 1,000 users viewing news page
- 50 news articles per page
- Each article = 3 translations (title, description, category)
- Server restarts daily

Daily API Calls:
├─ 1,000 users × 50 articles × 3 fields = 150,000 translations
├─ OpenAI cost: $0.0015 per 1K tokens
├─ Average: 100 tokens per translation
└─ Daily cost: ~$22.50 💸

Monthly cost: ~$675 💸💸💸
```

### With Redis (Persistent Cache)
```
Scenario: Same 1,000 users
- First user translates 50 articles → Store in Redis
- Next 999 users → Serve from Redis (FREE)

Daily API Calls:
├─ First load: 50 articles × 3 fields = 150 translations
├─ All others: 0 translations (cached)
└─ Daily cost: ~$0.02 ✅

Monthly cost: ~$0.60 ✅✅✅

Savings: 99.9% ($674.40/month saved!)
```

## Setup Instructions

### Option 1: Railway Redis (Recommended for Production)

Railway provides a managed Redis service that integrates seamlessly with your app.

#### Step 1: Add Redis to Railway Project

1. Go to your [Railway Dashboard](https://railway.app/)
2. Click on your project (Signals)
3. Click **"New"** → **"Database"** → **"Add Redis"**
4. Railway will automatically:
   - Create a Redis instance
   - Generate connection URL
   - Add `REDIS_URL` environment variable to your service

#### Step 2: Verify Environment Variables

Go to **Variables** tab and confirm you have:

```env
REDIS_URL=redis://default:xxxx@redis.railway.internal:6379
```

✅ **That's it!** Your app will automatically use Redis for translation caching.

#### Step 3: Add OpenAI API Key

In the same **Variables** tab, add:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get your key from: https://platform.openai.com/api-keys

#### Step 4: Deploy

Railway will automatically redeploy with the new environment variables. Translations will now be cached in Redis!

### Option 2: Upstash Redis (Free Tier Alternative)

If you prefer Upstash or need a free tier:

#### Step 1: Create Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Choose region closest to your Railway region (e.g., Europe West for EU deployment)
4. Copy the **Redis URL**

#### Step 2: Add to Railway

Go to Railway **Variables** tab and add:

```env
REDIS_URL=rediss://default:xxxxx@eu1-xxxxx-xxxxx.upstash.io:6379
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Step 3: Deploy

Click **"Deploy"** or push a new commit to trigger redeployment.

### Option 3: Local Development

For local testing:

#### Step 1: Install Redis Locally

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows (WSL):**
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

#### Step 2: Update `.env.local`

```env
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Step 3: Test

```bash
npm run dev
```

Visit http://localhost:5001/ur/news and translations will be cached in your local Redis.

## How It Works

### 1. First Request (Cache Miss)
```
User visits /ur/news
  │
  ├─> Fetch English news from APIs
  │
  ├─> Check Redis for Urdu translations
  │     └─> MISS (not cached)
  │
  ├─> Call OpenAI API to translate
  │     ├─> Title: "Bitcoin reaches $150K" → "بٹ کوائن $150K تک پہنچ گیا"
  │     ├─> Description: "..." → "..."
  │     └─> Category: "Crypto" → "کرپٹو"
  │
  ├─> Store in Redis (30 days TTL)
  │     └─> Key: "translation:title:12345" → "بٹ کوائن $150K تک پہنچ گیا"
  │
  └─> Display to user

Cost: $0.0015 per article (3 translations)
```

### 2. Subsequent Requests (Cache Hit)
```
Another user visits /ur/news
  │
  ├─> Fetch English news from APIs (same articles)
  │
  ├─> Check Redis for Urdu translations
  │     └─> HIT ✅ (found in cache!)
  │
  └─> Display cached translations

Cost: $0 (FREE!) ✅
```

### 3. Cache Management

**TTL (Time To Live):**
- 30 days default
- Extended on each access (LRU-style)
- Rarely-accessed translations auto-expire

**Storage:**
- Only translations that were actually requested
- No pre-translation of unused content
- ~1-2 KB per cached translation
- 10,000 translations ≈ 10-20 MB

## Environment Variables

Required for production:

```env
# Redis Connection (Railway sets this automatically)
REDIS_URL=redis://default:password@host:6379

# OpenAI API Key (required for translations)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: News API Keys (for fetching English news)
CRYPTOPANIC_API_KEY=your_key
NEWSAPI_KEY=your_key
FMP_API_KEY=your_key
```

## Monitoring

### Check Cache Stats

Add this API endpoint to check translation cache health:

```typescript
// src/app/api/admin/translation-stats/route.ts
import { getTranslationCacheStats } from '@/lib/translationCache';

export async function GET() {
  const stats = await getTranslationCacheStats();

  return Response.json({
    totalTranslations: stats.totalKeys,
    memoryUsage: stats.memoryUsage,
    estimated30DayCost: (stats.totalKeys * 0.0015).toFixed(2),
    monthlySavings: ((10000 - stats.totalKeys) * 0.0015).toFixed(2),
  });
}
```

### Railway Logs

Watch translation caching in action:

```bash
railway logs | grep -i translation
```

You should see:
```
✅ Redis cache hit for title: Bitcoin reaches $150K...
💾 Cached translation for title: Bitcoin reaches $150K...
🌐 Translated description: "..." → "..."
```

## Troubleshooting

### Issue: Translations not caching

**Check 1: Redis URL**
```bash
railway variables | grep REDIS_URL
```

**Check 2: Redis connectivity**
```bash
railway logs | grep -i redis
```

Should see: `Redis Client Connected`

**Check 3: OpenAI API Key**
```bash
railway variables | grep OPENAI_API_KEY
```

### Issue: High OpenAI costs

**Check cache hit rate:**

If you're still seeing high costs, check logs for cache misses:

```bash
railway logs | grep "🌐 Translated"
```

Ideally, you should see this ONLY on first request for new articles.

### Issue: Stale translations

Redis automatically expires translations after 30 days. To manually clear:

```typescript
import { clearTranslationCache } from '@/lib/translationCache';

// In your admin panel or API route
await clearTranslationCache();
```

## OpenAI API Key Setup

### Step 1: Get API Key

1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name it: "Railway Signals Production"
4. Copy the key (starts with `sk-proj-`)

### Step 2: Add to Railway

Go to Railway **Variables** tab:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Set Usage Limits (Recommended)

To prevent unexpected charges:

1. Go to https://platform.openai.com/account/billing/limits
2. Set **Hard limit**: $10/month (adjust as needed)
3. Set **Soft limit**: $5/month (get alerts)
4. Add your email for notifications

### Expected Costs with Redis Caching

```
Traffic Level        Monthly API Calls    Monthly Cost
─────────────────────────────────────────────────────────
0-1K users/day      ~150 translations     $0.23
1K-10K users/day    ~500 translations     $0.75
10K-100K users/day  ~2K translations      $3.00
100K+ users/day     ~10K translations     $15.00
```

Compare to **WITHOUT Redis**: $675/month for same traffic! 💸

## Testing

### Verify Redis Caching Works

1. **First request** (will call OpenAI):
   ```bash
   curl https://your-app.railway.app/ur/news
   ```

   Check logs:
   ```
   🌐 Translated title: "Bitcoin reaches $150K" → "بٹ کوائن $150K تک پہنچ گیا"
   💾 Cached translation for title...
   ```

2. **Second request** (should use cache):
   ```bash
   curl https://your-app.railway.app/ur/news
   ```

   Check logs:
   ```
   ✅ Redis cache hit for title: Bitcoin reaches $150K...
   ```

   No OpenAI API call = FREE! ✅

## Production Checklist

- [ ] Redis instance created in Railway
- [ ] `REDIS_URL` environment variable set
- [ ] `OPENAI_API_KEY` environment variable set
- [ ] OpenAI usage limits configured
- [ ] Application deployed successfully
- [ ] Test Urdu news page loads
- [ ] Verify Redis cache hits in logs
- [ ] Monitor OpenAI usage for 24 hours
- [ ] Confirm costs are < $0.10/day

## FAQ

**Q: Will this work without Redis?**
A: Yes! The app falls back to in-memory caching, but translations are lost on restart.

**Q: What happens if Redis is down?**
A: The app continues working, but translations won't be cached persistently.

**Q: How much does Railway Redis cost?**
A: $5-10/month, but saves you $600+/month in OpenAI costs!

**Q: Can I use a different Redis provider?**
A: Yes! Any Redis-compatible service works (Upstash, Redis Cloud, AWS ElastiCache, etc.)

**Q: How do I clear old translations?**
A: Redis automatically expires them after 30 days. No manual cleanup needed!

## Next Steps

1. ✅ Set up Redis (Railway or Upstash)
2. ✅ Add `OPENAI_API_KEY`
3. ✅ Deploy
4. ✅ Monitor costs
5. ✅ Enjoy 99% cost savings! 🎉

## Support

- **Redis Issues**: Check Railway Redis logs
- **Translation Issues**: Check OpenAI dashboard for usage
- **Cost Concerns**: Monitor via OpenAI usage page

---

**Estimated Setup Time**: 5 minutes
**Monthly Savings**: $600+ vs non-cached translations
**Cache Hit Rate**: 95-99% after first day
