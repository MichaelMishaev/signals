# News API Setup Guide

This guide explains how to set up the multi-source news aggregation system that fetches forex, crypto, and financial news from three different APIs.

## Overview

The news system aggregates content from:
1. **Financial Modeling Prep (FMP)** - Dedicated forex and crypto news
2. **CryptoPanic** - Community-driven crypto news with sentiment
3. **NewsAPI.org** - General financial news from 150,000+ sources

## Features

- ✅ **Multi-source aggregation** - Combines news from 3 APIs
- ✅ **Smart categorization** - Auto-categorizes as forex, crypto, or financial
- ✅ **Deduplication** - Removes duplicate articles across sources
- ✅ **Relevance scoring** - Ranks articles by relevance and freshness
- ✅ **Sentiment analysis** - Tracks positive/negative sentiment (CryptoPanic)
- ✅ **Filtering** - Filters by keywords for financial relevance

## Required API Keys

### 1. Financial Modeling Prep (FMP)

**Get your key:** https://financialmodelingprep.com/developer/docs/

**Free tier:**
- 250 requests/day
- Full access to forex and crypto news
- No credit card required for signup

**Environment variable:**
```bash
FMP_API_KEY=your_fmp_api_key_here
```

**API endpoints used:**
- `https://financialmodelingprep.com/api/v4/forex_news` - Forex news
- `https://financialmodelingprep.com/api/v4/crypto_news` - Crypto news

### 2. CryptoPanic API

**Get your key:** https://cryptopanic.com/developers/api/

**Free tier:**
- 1000 requests/day
- Community voting and sentiment data
- Impact indicators for important news

**Environment variable:**
```bash
CRYPTOPANIC_API_KEY=your_cryptopanic_api_key_here
```

**API endpoint used:**
- `https://cryptopanic.com/api/v1/posts/` - Crypto news with sentiment

### 3. NewsAPI.org

**Get your key:** https://newsapi.org/register

**Free tier:**
- 100 requests/day
- 150,000+ news sources
- Financial keyword filtering

**Environment variable:**
```bash
NEWSAPI_KEY=your_newsapi_key_here
```

**API endpoint used:**
- `https://newsapi.org/v2/everything` - General news with financial filtering

## Installation Steps

### Step 1: Get Your API Keys

1. Visit each API provider's website (links above)
2. Create a free account
3. Copy your API key

### Step 2: Create .env.local File

Create a file named `.env.local` in the root of your Next.js project:

```bash
# Financial Modeling Prep API
FMP_API_KEY=your_fmp_api_key_here

# CryptoPanic API
CRYPTOPANIC_API_KEY=your_cryptopanic_api_key_here

# NewsAPI
NEWSAPI_KEY=your_newsapi_key_here
```

### Step 3: Restart Development Server

```bash
npm run dev
```

The server will now use all three APIs to aggregate news.

## Usage

### Server-Side (Recommended)

```typescript
import { fetchAggregatedNews } from '@/utils/fetchNews';

// Get all news (default: 50 articles)
const news = await fetchAggregatedNews();

// Get news by category
const forexNews = await fetchAggregatedNews('Forex News', 20);
const cryptoNews = await fetchAggregatedNews('Crypto News', 20);
const financialNews = await fetchAggregatedNews('Market Analysis', 20);
```

### API Route

```bash
# Get all categorized news
GET /api/news/aggregated

# Get specific category
GET /api/news/aggregated?category=forex&limit=20

# Filter by relevance
GET /api/news/aggregated?minRelevance=0.5
```

### Response Format

```json
{
  "success": true,
  "categories": {
    "forex": {
      "count": 15,
      "articles": [...]
    },
    "crypto": {
      "count": 20,
      "articles": [...]
    },
    "financial": {
      "count": 15,
      "articles": [...]
    }
  },
  "all": {
    "count": 50,
    "articles": [...]
  }
}
```

## How It Works

### 1. Multi-Source Fetching

The system fetches news from all three sources in parallel:

```typescript
const [fmpArticles, cryptoPanicArticles, newsApiArticles] = await Promise.all([
  this.fetchFMPNews(),
  this.fetchCryptoPanicNews(),
  this.fetchNewsAPINews(),
]);
```

### 2. Categorization

Each article is automatically categorized:

- **Forex**: Articles mentioning forex, USD, EUR, GBP, JPY, currency trading
- **Crypto**: Articles mentioning cryptocurrency, bitcoin, ethereum, crypto market
- **Financial**: General financial news, market analysis, commodities

### 3. Deduplication

Duplicate articles are removed based on:
- URL similarity (normalized domain comparison)
- Title similarity (first 50 characters, normalized)

### 4. Relevance Scoring

Articles are scored based on:
- **FMP**: High relevance (0.9) - dedicated forex/crypto source
- **CryptoPanic**: Variable (0.5-1.0) - based on community votes
- **NewsAPI**: Variable (0.3-0.8) - based on keyword matches

### 5. Ranking

Final results are sorted by:
1. Relevance score (primary)
2. Publication date (secondary - newest first)

## Customization

### Adjust Financial Keywords

Edit the `FINANCIAL_KEYWORDS` array in `/src/utils/multiSourceNewsAggregator.ts`:

```typescript
const FINANCIAL_KEYWORDS = [
  'forex',
  'cryptocurrency',
  'bitcoin',
  // Add your custom keywords
  'PKR',
  'Pakistani rupee',
  'SECP',
];
```

### Change Relevance Thresholds

Adjust minimum relevance score when fetching:

```typescript
const articles = await aggregator.aggregateNews({
  minRelevanceScore: 0.5, // Higher = stricter filtering
});
```

### Modify Fetch Limits

Change how many articles to fetch from each source:

```typescript
// In multiSourceNewsAggregator.ts
const forexResponse = await fetch(
  `https://financialmodelingprep.com/api/v4/forex_news?page=0&size=100&apikey=${this.fmpApiKey}`
  // Change size=50 to size=100 for more articles
);
```

## Rate Limits

| API | Free Tier Limit | Articles per Request |
|-----|-----------------|---------------------|
| FMP | 250/day | Up to 100 |
| CryptoPanic | 1000/day | Up to 50 |
| NewsAPI | 100/day | Up to 50 |

**Total capacity:** ~1,350 requests/day

**Estimated article volume:** 5,000+ unique articles/day

## Caching

The API route includes built-in caching:

```typescript
export const revalidate = 300; // Cache for 5 minutes
```

This means:
- News is cached for 5 minutes
- Reduces API calls by ~288x per day
- Stays within free tier limits easily

## Troubleshooting

### Error: "Missing API keys"

**Solution:** Ensure all three API keys are set in `.env.local`

### Error: "Rate limit exceeded"

**Solution:**
1. Increase `revalidate` time (cache longer)
2. Reduce fetch frequency
3. Upgrade to paid tier

### No articles returned

**Solution:**
1. Check API keys are valid
2. Verify internet connection
3. Check API status pages
4. Review console logs for specific errors

### Articles not categorized correctly

**Solution:**
1. Add more keywords to `FINANCIAL_KEYWORDS`
2. Adjust categorization logic in `transformNewsAPIArticle()`

## Performance Tips

1. **Use server-side fetching** - Fetch in Server Components, not client-side
2. **Enable caching** - Use the `revalidate` setting
3. **Limit results** - Fetch only what you need (e.g., 20 articles)
4. **Filter by relevance** - Use higher `minRelevanceScore` for quality

## Example Implementation

See the live implementation in:
- `/src/app/[locale]/news/page.tsx` - News page
- `/src/utils/multiSourceNewsAggregator.ts` - Aggregator logic
- `/src/app/api/news/aggregated/route.ts` - API route

## Support

For issues:
1. Check the console logs for detailed error messages
2. Verify API keys are active
3. Test each API individually
4. Review the API provider's documentation

## License

This news aggregation system is part of TradeSignal PK and follows the project's license.
