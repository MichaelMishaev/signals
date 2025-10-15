# News Aggregation System Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│              /en/news (Server-Side Rendered)                     │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SERVER COMPONENT                              │
│              fetchAggregatedNews()                               │
│              /src/utils/fetchNews.ts                             │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                MULTI-SOURCE AGGREGATOR                           │
│          /src/utils/multiSourceNewsAggregator.ts                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Parallel Fetching (Promise.all)                       │    │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────┐       │    │
│  │  │   FMP    │  │CryptoPanic│  │   NewsAPI    │       │    │
│  │  │  Forex   │  │   Crypto  │  │   Financial  │       │    │
│  │  │  Crypto  │  │ Sentiment │  │   Keywords   │       │    │
│  │  └────┬─────┘  └─────┬─────┘  └──────┬───────┘       │    │
│  └───────┼──────────────┼────────────────┼───────────────┘    │
│          │              │                │                     │
│  ┌───────▼──────────────▼────────────────▼───────────────┐    │
│  │         Transform to Common Format                     │    │
│  │  • id, title, description, url, date                   │    │
│  │  • category (forex/crypto/financial)                   │    │
│  │  • relevanceScore (0-1)                                │    │
│  │  • sentiment (positive/negative/neutral)               │    │
│  └───────────────────────┬────────────────────────────────┘    │
│                          │                                     │
│  ┌───────────────────────▼────────────────────────────────┐    │
│  │              Smart Processing                          │    │
│  │  1. Deduplicate (URL + Title matching)                 │    │
│  │  2. Filter by relevance (min 0.3)                      │    │
│  │  3. Sort by relevance + date                           │    │
│  │  4. Limit results (default 50)                         │    │
│  └───────────────────────┬────────────────────────────────┘    │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    CATEGORIZED OUTPUT                            │
│                                                                  │
│  ┌────────────┐  ┌──────────┐  ┌────────────────┐             │
│  │   Forex    │  │  Crypto  │  │   Financial    │             │
│  │   News     │  │   News   │  │    Analysis    │             │
│  │  (15-20)   │  │ (20-25)  │  │    (10-15)     │             │
│  └────────────┘  └──────────┘  └────────────────┘             │
│                                                                  │
│            Combined & Sorted (50 total)                         │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    CLIENT COMPONENT                              │
│              <NewsPageClient />                                  │
│              /src/components/news/NewsPageClient.tsx             │
│                                                                  │
│  • Category filtering (Forex/Crypto/Financial/All)              │
│  • Search functionality                                          │
│  • Card display with images                                      │
│  • External link handling                                        │
└──────────────────────────────────────────────────────────────────┘
```

## API Integration Details

### 1. Financial Modeling Prep (FMP)

```
┌─────────────────────────────────────────────────────────┐
│                    FMP API                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Forex Endpoint:                                        │
│  └─ /api/v4/forex_news                                  │
│     ├─ Parameters: page=0, size=50                      │
│     └─ Response: [{title, text, url, publishedDate}]    │
│                                                         │
│  Crypto Endpoint:                                       │
│  └─ /api/v4/crypto_news                                 │
│     ├─ Parameters: page=0, size=50                      │
│     └─ Response: [{title, text, url, publishedDate}]    │
│                                                         │
│  Transform:                                             │
│  └─ category = 'forex' | 'crypto'                       │
│  └─ relevanceScore = 0.9 (high confidence)              │
│                                                         │
│  Rate Limit: 250 requests/day (free)                    │
│  Priority: HIGH ⭐                                       │
└─────────────────────────────────────────────────────────┘
```

### 2. CryptoPanic

```
┌─────────────────────────────────────────────────────────┐
│                  CryptoPanic API                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Endpoint:                                              │
│  └─ /api/v1/posts/                                      │
│     ├─ Parameters:                                      │
│     │   • public=true                                   │
│     │   • kind=news                                     │
│     │   • filter=important                              │
│     └─ Response: {                                      │
│          results: [{                                    │
│            id, title, url, published_at,                │
│            votes: {positive, negative, important},      │
│            currencies: [{code}]                         │
│          }]                                             │
│        }                                                │
│                                                         │
│  Transform:                                             │
│  └─ category = 'crypto'                                 │
│  └─ sentiment = calculate from votes                    │
│  └─ relevanceScore = 0.5 + (votes/100)                  │
│                                                         │
│  Rate Limit: 1000 requests/day (free)                   │
│  Priority: MEDIUM                                       │
└─────────────────────────────────────────────────────────┘
```

### 3. NewsAPI

```
┌─────────────────────────────────────────────────────────┐
│                     NewsAPI                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Endpoint:                                              │
│  └─ /v2/everything                                      │
│     ├─ Parameters:                                      │
│     │   • q = "forex OR crypto OR bitcoin..."          │
│     │   • language = en                                 │
│     │   • sortBy = publishedAt                          │
│     │   • pageSize = 50                                 │
│     └─ Response: {                                      │
│          articles: [{                                   │
│            title, description, url, publishedAt,        │
│            source: {name},                              │
│            urlToImage                                   │
│          }]                                             │
│        }                                                │
│                                                         │
│  Financial Keywords:                                    │
│  ├─ forex, cryptocurrency, bitcoin, ethereum            │
│  ├─ USD, EUR, GBP, JPY, trading                         │
│  └─ commodities, gold, silver, financial markets        │
│                                                         │
│  Transform:                                             │
│  └─ category = auto-detect from content                 │
│  └─ relevanceScore = 0.3 + (keyword_matches * 0.1)      │
│                                                         │
│  Rate Limit: 100 requests/day (free)                    │
│  Priority: LOW (broader coverage)                       │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
REQUEST                  PROCESSING                    RESPONSE
────────                ────────────                  ─────────

  User
  visits
  /news
    │
    ├─────────────────▶ Server Component
    │                   fetchAggregatedNews()
    │                        │
    │                        ├────▶ Get Aggregator Instance
    │                        │      (singleton pattern)
    │                        │
    │                        ├────▶ Parallel API Calls
    │                        │      │
    │                        │      ├─▶ FMP Forex
    │                        │      │   └─▶ 20-30 articles
    │                        │      │
    │                        │      ├─▶ FMP Crypto
    │                        │      │   └─▶ 20-30 articles
    │                        │      │
    │                        │      ├─▶ CryptoPanic
    │                        │      │   └─▶ 15-25 articles
    │                        │      │
    │                        │      └─▶ NewsAPI
    │                        │          └─▶ 10-20 articles
    │                        │                │
    │                        │      ┌─────────┴───────┐
    │                        │      │ 65-105 articles │
    │                        │      └─────────┬───────┘
    │                        │                │
    │                        ├────▶ Deduplicate
    │                        │      └─▶ 50-80 unique
    │                        │
    │                        ├────▶ Filter by Relevance
    │                        │      └─▶ 40-70 relevant
    │                        │
    │                        ├────▶ Sort by Score + Date
    │                        │      └─▶ Best 50
    │                        │
    │                        ├────▶ Convert to INewsArticle
    │                        │      └─▶ Format for UI
    │                        │
    │                        └────▶ Return to Page
    │                               │
    ├───────────────────────────────┘
    │
    └────────────────▶ Client Component
                      <NewsPageClient />
                           │
                           ├─▶ Display cards
                           ├─▶ Category filter
                           └─▶ Search filter
                               │
                               ▼
                           User sees
                           filtered news
```

## Performance Optimization

### Caching Strategy

```
┌────────────────────────────────────────────────────────┐
│                   Cache Layers                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. Next.js Route Cache (5 minutes)                    │
│     └─ Reduces API calls by 288x per day              │
│                                                        │
│  2. Aggregator Singleton                               │
│     └─ Reuses same instance across requests            │
│                                                        │
│  3. Browser Cache (optional)                           │
│     └─ Can add client-side caching                     │
│                                                        │
└────────────────────────────────────────────────────────┘

Without Cache:
├─ 100 users × 10 visits/day = 1,000 API calls
└─ Would exceed free tier limits ❌

With Cache (5 min):
├─ 1,440 min/day ÷ 5 min = 288 cached requests
├─ Serves all users from cache
└─ Uses only 288 API calls total ✅
```

### Parallel Processing

```
Sequential (old):
├─ FMP Forex:      2s ─┐
├─ FMP Crypto:     2s  ├─ Total: 8s
├─ CryptoPanic:    2s  │
└─ NewsAPI:        2s ─┘

Parallel (new):
├─ All sources: max(2s, 2s, 2s, 2s) = 2-3s ✅
└─ 60% faster
```

## Error Handling

```
┌────────────────────────────────────────────────────────┐
│                 Error Strategies                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  API Timeout:                                          │
│  └─ Continue with other sources                        │
│  └─ Don't block entire response                        │
│                                                        │
│  Rate Limit:                                           │
│  └─ Log warning                                        │
│  └─ Serve from cache                                   │
│  └─ Skip that source temporarily                       │
│                                                        │
│  Invalid API Key:                                      │
│  └─ Throw error on startup                             │
│  └─ Clear error message                                │
│                                                        │
│  No Articles:                                          │
│  └─ Return empty array                                 │
│  └─ UI shows "No news available"                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Scalability

### Current Capacity (Free Tier)

```
Daily Limits:
├─ FMP:          250 requests
├─ CryptoPanic:  1,000 requests
├─ NewsAPI:      100 requests
└─ Total:        1,350 requests/day

With Caching (5 min):
├─ Effective:    ~400,000 requests/day
├─ Support:      ~40,000 users/day
└─ Cost:         $0/month ✅
```

### Upgrade Path

```
Traffic Growth        Action              Cost
─────────────────────────────────────────────────
0-10K users/day    → Free tier          $0/mo
10K-100K           → Basic plans        $30/mo
100K-1M            → Pro plans          $200/mo
1M+                → Enterprise         Custom
```

## Monitoring Points

```
Key Metrics:
├─ API Response Times
│  └─ Alert if > 5s
│
├─ Cache Hit Rate
│  └─ Target: > 95%
│
├─ Rate Limit Usage
│  └─ Alert if > 80%
│
├─ Deduplication Rate
│  └─ Target: 20-30% duplicates removed
│
└─ Relevance Score Distribution
   └─ Target: 70% above 0.5
```

## Future Enhancements

```
Phase 2:
├─ Add more sources (Alpha Vantage, Benzinga)
├─ Pakistani market focus (PKR, PSX, SECP)
├─ ML-based relevance scoring
└─ Real-time updates via WebSocket

Phase 3:
├─ User preferences
├─ Saved articles
├─ Email notifications
└─ Mobile app integration
```
