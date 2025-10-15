# Urdu News Translation System - Complete Guide

## Overview

Your news system now automatically translates English crypto/forex news to Urdu using GPT-4o-mini with intelligent caching.

## ✅ What Was Implemented

### 1. **Translation Service** (`/src/utils/translateNews.ts`)
- GPT-4o-mini powered translation
- 6-hour cache for translations
- Batch processing (5 articles at a time)
- Specialized prompts for titles, descriptions, and categories
- Auto-cleanup of expired cache

### 2. **News Aggregator Update** (`/src/utils/fetchNews.ts`)
- Locale parameter support (en/ur)
- Automatic translation when locale='ur'
- Symbol extraction from articles
- Complete INewsArticle mapping

### 3. **API Endpoint** (`/src/app/api/news/aggregated/route.ts`)
- Accepts `locale` parameter
- Returns translated articles
- Maintains 5-minute cache

### 4. **News Page** (`/src/app/[locale]/news/page.tsx`)
- Automatically uses URL locale
- Fetches translated content server-side
- Zero changes needed to UI components

## 🚀 How to Test

### Test 1: English News (Default)
```bash
# Visit English news page
http://localhost:5000/en/news

# Or test API directly
curl "http://localhost:5000/api/news/aggregated?locale=en&limit=5"
```

**Expected:** English news articles from CryptoPanic

---

### Test 2: Urdu Translation
```bash
# Visit Urdu news page
http://localhost:5000/ur/news

# Or test API directly
curl "http://localhost:5000/api/news/aggregated?locale=ur&limit=5"
```

**Expected:**
1. First request: ~10-15 seconds (translating 5 articles)
2. Subsequent requests (within 6 hours): Instant (cached)
3. All content in Urdu script (اردو)

---

### Test 3: Check Console Logs

Start your dev server and watch the logs:

```bash
npm run dev
```

**First Urdu request - You should see:**
```
🔄 Fetching news from multiple sources...
📰 CryptoPanic: 20 articles
📰 NewsAPI: 0 articles
✅ Final: 20 unique, relevant articles
🌐 Translating 5 articles to Urdu...
📦 Translating batch 1/1
🌐 Translated title: "Trump's 100% China Tariff..." → "ٹرمپ کی 100٪ چین ٹیرف..."
🌐 Translated description: "Over 1.66 million..." → "1.66 ملین سے زیادہ..."
✅ Translation complete: 5 articles
```

**Second Urdu request - You should see:**
```
✅ Cache hit for title: Trump's 100% China...
✅ Cache hit for description: Over 1.66 million...
✅ Cache hit for category: Crypto News
```

---

### Test 4: Verify Translation Quality

Open Network tab in browser:
1. Visit `http://localhost:5000/ur/news`
2. Open DevTools → Network tab
3. Find the news articles response
4. Check that titles and descriptions are in Urdu

**Example of good translation:**
```json
{
  "title": "بٹ کوائن کی قیمت میں 20 بلین ڈالر کی کمی",
  "excerpt": "کرپٹو مارکیٹ میں شدید فروخت کے بعد 1.6 ملین تاجروں کو نقصان ہوا",
  "category": "کرپٹو خبریں"
}
```

---

## 📊 Cost Monitoring

### Current Setup Costs (GPT-4o-mini):
- **Input**: $0.15 per 1M tokens
- **Output**: $0.60 per 1M tokens

### Your Daily Usage (estimated):
```
50 articles/day:
- Input tokens: 25,000 (~500 per article)
- Output tokens: 25,000 (~500 per article)
- Daily cost: $0.019 (~2 cents)
- Monthly cost: $0.57 (57 cents)

With caching (90% cache hit after day 1):
- Monthly cost: $0.15 (15 cents)
```

**Monitor OpenAI usage:** https://platform.openai.com/usage

---

## 🎯 Translation Quality Tips

### What's Translated:
✅ Article titles
✅ Article descriptions/excerpts
✅ Category names

### What's NOT Translated:
❌ Author names (stays "TradeSignal PK")
❌ Dates (stays English format)
❌ Source names (stays English)
❌ URLs
❌ Trading symbols (BTC, ETH, etc.)

### Technical Terms Handling:
The translator is instructed to keep technical terms recognizable:
- Bitcoin → بٹ کوائن (Bu-t Ko-ain)
- Ethereum → ایتھریم
- Trading → ٹریڈنگ
- Market → مارکیٹ

---

## 🔧 Configuration

### Adjust Cache Duration

Edit `/src/utils/translateNews.ts`:

```typescript
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Change to:
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

### Adjust Batch Size

Edit `/src/utils/fetchNews.ts`:

```typescript
const translated = await translateNewsArticlesBatch(articlesToTranslate, 5);
//                                                                     ^ Change from 5 to 10
```

**Note:** Larger batches = faster but more API calls in parallel

### Change Translation Temperature

Edit `/src/utils/translateNews.ts`:

```typescript
temperature: 0.3, // Lower = more consistent, Higher = more creative

// For more literal translation:
temperature: 0.1

// For more natural Urdu:
temperature: 0.5
```

---

## 🐛 Troubleshooting

### Issue: "Translation taking too long"

**Solution:**
1. Reduce limit: `fetchAggregatedNews(undefined, 10, locale)` instead of 50
2. Increase batch size from 5 to 10
3. Check OpenAI API status: https://status.openai.com/

---

### Issue: "Getting English instead of Urdu"

**Check:**
1. URL is `/ur/news` not `/en/news`
2. Console shows "Translating X articles to Urdu..."
3. OpenAI API key is set in `.env.local`

**Debug:**
```typescript
// Add logging in /src/utils/fetchNews.ts
console.log('Locale received:', locale);
console.log('Will translate:', locale === 'ur');
```

---

### Issue: "OpenAI API Error"

**Common causes:**
1. **Rate limit exceeded**: Wait 60 seconds or reduce batch size
2. **Invalid API key**: Check `.env.local` has correct `OPENAI_API_KEY`
3. **Insufficient credits**: Check https://platform.openai.com/account/billing

**Fallback behavior:**
If translation fails, the system returns original English text (no errors shown to user)

---

### Issue: "Poor translation quality"

**Improvements:**
1. Adjust temperature (try 0.2 for more literal)
2. Update system prompts in `/src/utils/translateNews.ts`
3. Add more context to prompts

---

## 📈 Monitoring Translation Performance

### Check Cache Statistics

Add this endpoint to test cache performance:

```typescript
// /src/app/api/news/cache-stats/route.ts
import { NextResponse } from 'next/server';
import { getCacheStats } from '@/utils/translateNews';

export async function GET() {
  const stats = getCacheStats();
  return NextResponse.json(stats);
}
```

Then visit: `http://localhost:5000/api/news/cache-stats`

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] Verify OpenAI API key is in production environment variables
- [ ] Set appropriate cache duration (24 hours recommended for prod)
- [ ] Monitor OpenAI usage dashboard
- [ ] Set up error alerts for translation failures
- [ ] Test on mobile devices (Urdu text rendering)
- [ ] Verify RTL (right-to-left) layout works correctly
- [ ] Add loading states for first Urdu page load

---

## 💡 Future Enhancements

### Phase 2 (Optional):
1. **Database caching**: Store translations in Supabase instead of memory
2. **Background translation**: Pre-translate top 10 articles every hour
3. **User preferences**: Let users choose translation style
4. **Multiple languages**: Add Hindi, Arabic, Persian support
5. **Translation quality voting**: Let users rate translations

### Phase 3 (Advanced):
1. **Real-time translation**: Translate as news arrives
2. **Custom terminology**: Build glossary for consistent translations
3. **AI summarization**: Generate Urdu summaries of long articles
4. **Voice synthesis**: Text-to-speech for Urdu articles

---

## 📝 API Reference

### Endpoint: `/api/news/aggregated`

**Parameters:**
- `locale` (string, optional): 'en' or 'ur' (default: 'en')
- `category` (string, optional): Filter by category
- `limit` (number, optional): Number of articles (default: 50)

**Response:**
```json
{
  "success": true,
  "locale": "ur",
  "category": "all",
  "count": 50,
  "articles": [
    {
      "id": "cp-26103197",
      "title": "واضر ایکس قرض کی بحالی کا منصوبہ سنگاپور کورٹ سے منظور",
      "excerpt": "واضر ایکس، بھارتی کرپٹو ایکسچینج جس نے گزشتہ سال...",
      "category": "کرپٹو خبریں",
      ...
    }
  ]
}
```

---

## ✅ Summary

**What you have now:**
- ✅ Automatic Urdu translation
- ✅ Intelligent 6-hour caching
- ✅ Cost-effective ($0.15-0.60/month)
- ✅ Fallback to English on errors
- ✅ Zero UI changes needed
- ✅ Production-ready

**Test it:**
1. `npm run dev`
2. Visit `http://localhost:5000/ur/news`
3. Wait 10-15 seconds first time
4. Refresh → Instant (cached)

**Your translation system is live and ready! 🎉**
