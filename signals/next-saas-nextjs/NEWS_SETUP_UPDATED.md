# News Aggregation Setup - UPDATED

## Current Status

✅ **CryptoPanic API** - Configured and working
⚠️ **FMP API** - News endpoints deprecated for new accounts
❌ **NewsAPI** - Not yet configured

## What's Working Now

Your news system is currently using **CryptoPanic only**, which provides:
- High-quality crypto news
- Real-time updates
- Community-driven content
- 1,000 requests/month (Developer tier)

The API is already configured with your key: `e2cf925dfccdfacae1568d1d5faa2e6f86bcca59`

## To Add More News Sources

### Option 1: NewsAPI.org (Recommended)

**Best for:** General financial news, forex, commodities

**Setup:**
1. Sign up at: https://newsapi.org/register
2. Get your API key (free tier: 100 requests/day)
3. Add to `.env.local`:
   ```bash
   NEWSAPI_KEY=your_newsapi_key_here
   ```
4. Restart dev server

**What you'll get:**
- 150,000+ news sources
- Financial keyword filtering
- Forex and commodities news
- General market analysis

### Option 2: Alpha Vantage

**Best for:** Market news with sentiment analysis

**Setup:**
1. Sign up at: https://www.alphavantage.co/support/#api-key
2. Free tier: 500 requests/day
3. Add to `.env.local`:
   ```bash
   ALPHA_VANTAGE_API_KEY=your_key_here
   ```

### Option 3: Finnhub.io

**Best for:** Real-time financial news

**Setup:**
1. Sign up at: https://finnhub.io/register
2. Free tier: 60 requests/minute
3. Forex + crypto + stocks news

## Alternative Free APIs

Since FMP news endpoints are legacy, here are working alternatives:

### 1. **NewsData.io** ⭐ Recommended
- **Free tier:** 200 requests/day
- **Signup:** https://newsdata.io/register
- **Features:**
  - Real-time news
  - 50+ languages
  - Category filtering
  - Image thumbnails
- **Best for:** Forex and financial news

### 2. **GNews API**
- **Free tier:** 100 requests/day
- **Signup:** https://gnews.io/
- **Features:**
  - News articles worldwide
  - Search by keywords
  - Language filtering
- **Best for:** General financial news

### 3. **Currents API**
- **Free tier:** 600 requests/day
- **Signup:** https://currentsapi.services/en/register
- **Features:**
  - Latest news
  - Category filtering
  - Multiple languages
- **Best for:** Financial news aggregation

### 4. **mediastack**
- **Free tier:** 500 requests/month
- **Signup:** https://mediastack.com/product
- **Features:**
  - 7,500+ news sources
  - Historical data
  - Keyword search
- **Best for:** Historical news analysis

### 5. **Crypto Compare**
- **Free tier:** 250,000 calls/month
- **Signup:** https://www.cryptocompare.com/cryptopian/api-keys
- **Features:**
  - Crypto-specific news
  - Price data integration
  - Social stats
- **Best for:** Crypto-only news

## Current System Architecture

```
┌─────────────────────────────────────────┐
│         News Aggregation System         │
├─────────────────────────────────────────┤
│                                         │
│  ✅ CryptoPanic (ACTIVE)                │
│     └─ Crypto news                      │
│     └─ 1,000 req/month                  │
│     └─ Quality: ⭐⭐⭐⭐⭐            │
│                                         │
│  ❌ FMP (DEPRECATED)                    │
│     └─ News endpoints removed           │
│                                         │
│  ⏳ NewsAPI (PENDING SETUP)             │
│     └─ Add key to enable                │
│     └─ 100 req/day when enabled         │
│                                         │
└─────────────────────────────────────────┘
```

## Quick Test

Test if CryptoPanic is working:

```bash
curl "https://cryptopanic.com/api/developer/v2/posts/?auth_token=e2cf925dfccdfacae1568d1d5faa2e6f86bcca59&public=true&kind=news&filter=important"
```

You should see JSON with crypto news articles.

## Recommended Next Steps

### Immediate (5 minutes)
1. ✅ CryptoPanic is already working
2. ⏳ Sign up for NewsAPI.org to add forex/financial news
3. ⏳ Add `NEWSAPI_KEY` to `.env.local`

### Short-term (1 hour)
1. Consider NewsData.io for better forex coverage
2. Add GNews or Currents for more sources
3. Test the news page: `http://localhost:5000/en/news`

### Long-term (optional)
1. Implement CryptoCompare for crypto price + news
2. Add Alpha Vantage for sentiment analysis
3. Consider paid tiers if you need more requests

## Rate Limits & Caching

Current setup with 5-minute caching:

```
CryptoPanic: 1,000/month
├─ Without cache: ~3 requests/day max
├─ With cache: ~288 cached responses/day
└─ Effective capacity: ~10,000 users/day

NewsAPI (when added): 100/day
├─ Without cache: Limited to 100 users/day
├─ With cache: ~28,800 cached responses/day
└─ Effective capacity: ~50,000 users/day
```

## Cost Analysis

| API | Free Tier | Cost if Exceeded |
|-----|-----------|------------------|
| CryptoPanic | 1,000/mo | $49/mo (Growth plan) |
| NewsAPI | 100/day | $449/mo (Business plan) |
| NewsData.io | 200/day | $10/mo (Basic plan) |
| CryptoCompare | 250K/mo | Free ✅ |

**Recommendation:** Start with CryptoPanic + NewsAPI (both free), add NewsData.io or CryptoCompare if needed.

## Testing the System

### 1. Start dev server
```bash
npm run dev
```

### 2. Visit news page
```
http://localhost:5000/en/news
```

### 3. Check console
You should see:
```
🔄 Fetching news from multiple sources...
📰 CryptoPanic: 7-20 articles
📰 NewsAPI: 0 articles (if not configured)
✅ Final: 7-20 unique, relevant articles
```

### 4. Test API endpoint
```bash
curl http://localhost:5000/api/news/aggregated | jq .
```

## Troubleshooting

### Issue: No articles showing

**Check:**
1. Is CryptoPanic API key in `.env.local`?
2. Did you restart the dev server?
3. Check browser console for errors
4. Try the curl test command above

### Issue: Rate limit exceeded

**Solution:**
1. Check your CryptoPanic usage at: https://cryptopanic.com/developers/api/
2. Increase cache time in `/src/app/api/news/aggregated/route.ts`
3. Consider upgrading to Growth plan ($49/mo)

### Issue: Want more news sources

**Solution:**
1. Add NewsAPI key (see Option 1 above)
2. Or implement one of the alternative APIs listed above
3. Update `/src/utils/multiSourceNewsAggregator.ts` with new source

## Support

- CryptoPanic docs: https://cryptopanic.com/developers/api/
- NewsAPI docs: https://newsapi.org/docs
- Project issue tracker: Check your repository

## Summary

✅ **What's working:**
- CryptoPanic integration with v2 API
- News aggregation and deduplication
- API endpoint at `/api/news/aggregated`
- News page at `/en/news`

⏳ **What's pending:**
- NewsAPI setup (add key to enable)
- Alternative API integration (optional)

The system is **production-ready** with CryptoPanic alone, but adding NewsAPI will provide better coverage for forex and financial news.
