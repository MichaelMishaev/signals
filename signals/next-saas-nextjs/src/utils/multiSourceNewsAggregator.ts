// Multi-source news aggregator for forex and crypto news
// Combines: CryptoPanic and NewsAPI (FMP news endpoints are legacy)

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: 'forex' | 'crypto' | 'financial';
  image?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevanceScore?: number;
}

// CryptoPanic v2 API response types
interface CryptoPanicArticle {
  id: number;
  slug: string;
  title: string;
  description: string;
  published_at: string;
  created_at: string;
  kind: string;
  source: {
    title: string;
    region: string;
    domain: string;
    type: string;
  };
  original_url: string;
  url: string;
  image: string;
  instruments?: Array<{
    code: string;
    title: string;
    slug: string;
    market_cap_usd?: number;
    price_in_usd?: number;
  }>;
  votes?: {
    negative: number;
    positive: number;
    important: number;
    liked: number;
    disliked: number;
    lol: number;
    toxic: number;
    saved: number;
    comments: number;
  };
  panic_score?: number;
  panic_score_1h?: number;
  author?: string;
}

interface NewsAPIArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  urlToImage?: string;
}

// Financial keywords for NewsAPI filtering
const FINANCIAL_KEYWORDS = [
  'forex',
  'cryptocurrency',
  'bitcoin',
  'ethereum',
  'trading',
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'gold',
  'silver',
  'commodities',
  'financial markets',
  'stock market',
  'crypto market',
];

export class MultiSourceNewsAggregator {
  private cryptoPanicApiKey: string;
  private newsApiKey: string;

  constructor(cryptoPanicApiKey: string, newsApiKey: string) {
    this.cryptoPanicApiKey = cryptoPanicApiKey;
    this.newsApiKey = newsApiKey;
  }

  // Fetch from CryptoPanic v2 API
  private async fetchCryptoPanicNews(): Promise<NewsArticle[]> {
    const articles: NewsArticle[] = [];

    if (!this.cryptoPanicApiKey) {
      console.warn('CryptoPanic API key not configured');
      return articles;
    }

    try {
      // Fetch from CryptoPanic v2 developer endpoint
      const response = await fetch(
        `https://cryptopanic.com/api/developer/v2/posts/?auth_token=${this.cryptoPanicApiKey}&public=true&kind=news&filter=important`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          articles.push(
            ...data.results.map((article: CryptoPanicArticle) =>
              this.transformCryptoPanicArticle(article)
            )
          );
        }
      } else if (response.status === 429) {
        // Quota exceeded - silently ignore and continue with other sources
        console.warn('CryptoPanic API quota exceeded, skipping this source');
      } else {
        // Log other errors but don't throw
        console.warn('CryptoPanic API error:', response.status);
      }
    } catch (error) {
      // Silently handle errors - don't break the site
      console.warn('CryptoPanic API request failed, skipping this source');
    }

    return articles;
  }

  private transformCryptoPanicArticle(article: CryptoPanicArticle): NewsArticle {
    // Calculate sentiment based on votes (if available)
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (article.votes) {
      const { positive, negative, liked, disliked } = article.votes;
      const totalPositive = positive + liked;
      const totalNegative = negative + disliked;

      if (totalPositive > totalNegative * 2) sentiment = 'positive';
      else if (totalNegative > totalPositive * 2) sentiment = 'negative';
    }

    // Calculate relevance score based on panic score and votes
    let relevanceScore = 0.7; // Base score for CryptoPanic (good quality)

    // Use panic_score if available (0-100 scale)
    if (article.panic_score) {
      relevanceScore = Math.min(0.5 + article.panic_score / 100, 1.0);
    } else if (article.votes) {
      // Fallback to votes-based scoring
      const totalVotes = article.votes.positive + article.votes.negative + article.votes.important;
      relevanceScore = Math.min(0.6 + totalVotes / 100, 1.0);
    }

    // Determine category - crypto is primary, but check for forex/financial mentions
    let category: 'forex' | 'crypto' | 'financial' = 'crypto';
    const text = `${article.title} ${article.description || ''}`.toLowerCase();

    if (text.includes('forex') || text.includes('currency exchange')) {
      category = 'forex';
    } else if (
      text.includes('stock') ||
      text.includes('traditional finance') ||
      text.includes('equities')
    ) {
      category = 'financial';
    }

    // Build CryptoPanic URL from slug
    const cpUrl = `https://cryptopanic.com/news/${article.slug}`;

    // Use instruments (currencies) for additional description if available
    const instrumentsStr = article.instruments?.map((i) => i.code).join(', ');
    const enhancedDescription = instrumentsStr
      ? `${article.description || ''} [${instrumentsStr}]`
      : article.description || 'Crypto market news';

    return {
      id: `cp-${article.id}`,
      title: article.title,
      description: enhancedDescription,
      url: article.original_url || cpUrl, // Prefer original source URL
      publishedAt: article.published_at,
      source: article.source?.title
        ? `CryptoPanic - ${article.source.title}`
        : 'CryptoPanic',
      category,
      image: article.image || undefined,
      sentiment,
      relevanceScore,
    };
  }

  // Fetch from NewsAPI with financial filtering
  private async fetchNewsAPINews(): Promise<NewsArticle[]> {
    const articles: NewsArticle[] = [];

    if (!this.newsApiKey) {
      console.warn('NewsAPI key not configured');
      return articles;
    }

    try {
      // Use 'everything' endpoint with financial keywords
      const query = FINANCIAL_KEYWORDS.slice(0, 5).join(' OR '); // Limit to avoid URL length issues
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=50&apikey=${this.newsApiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.articles && Array.isArray(data.articles)) {
          articles.push(
            ...data.articles
              .filter((article: NewsAPIArticle) => this.isFinanciallyRelevant(article))
              .map((article: NewsAPIArticle) => this.transformNewsAPIArticle(article))
          );
        }
      } else if (response.status === 429) {
        // Quota exceeded - silently ignore and continue with other sources
        console.warn('NewsAPI quota exceeded, skipping this source');
      } else if (response.status === 401) {
        // Invalid API key - silently ignore
        console.warn('NewsAPI authentication failed, skipping this source');
      } else {
        // Log other errors but don't throw
        console.warn('NewsAPI error:', response.status);
      }
    } catch (error) {
      // Silently handle errors - don't break the site
      console.warn('NewsAPI request failed, skipping this source');
    }

    return articles;
  }

  private isFinanciallyRelevant(article: NewsAPIArticle): boolean {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return FINANCIAL_KEYWORDS.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );
  }

  private transformNewsAPIArticle(article: NewsAPIArticle): NewsArticle {
    // Categorize based on content
    const text = `${article.title} ${article.description}`.toLowerCase();
    let category: 'forex' | 'crypto' | 'financial' = 'financial';

    if (
      text.includes('crypto') ||
      text.includes('bitcoin') ||
      text.includes('ethereum')
    ) {
      category = 'crypto';
    } else if (
      text.includes('forex') ||
      text.includes('usd') ||
      text.includes('eur') ||
      text.includes('currency')
    ) {
      category = 'forex';
    }

    // Calculate relevance score based on keyword matches
    const keywordMatches = FINANCIAL_KEYWORDS.filter((kw) =>
      text.includes(kw.toLowerCase())
    ).length;
    const relevanceScore = Math.min(0.3 + keywordMatches * 0.1, 0.8);

    return {
      id: `newsapi-${Buffer.from(article.url).toString('base64').slice(0, 16)}`,
      title: article.title,
      description: article.description || '',
      url: article.url,
      publishedAt: article.publishedAt,
      source: `NewsAPI - ${article.source.name}`,
      category,
      image: article.urlToImage,
      relevanceScore,
    };
  }

  // Deduplicate articles based on URL and title similarity
  private deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
    const seen = new Set<string>();
    const unique: NewsArticle[] = [];

    for (const article of articles) {
      // Normalize URL for comparison
      const normalizedUrl = article.url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '');

      // Normalize title for comparison
      const normalizedTitle = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .slice(0, 50);

      const key = `${normalizedUrl}|${normalizedTitle}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(article);
      }
    }

    return unique;
  }

  // Main aggregation function
  async aggregateNews(options?: {
    categories?: Array<'forex' | 'crypto' | 'financial'>;
    limit?: number;
    minRelevanceScore?: number;
  }): Promise<NewsArticle[]> {
    const {
      categories = ['forex', 'crypto', 'financial'],
      limit = 50,
      minRelevanceScore = 0.3,
    } = options || {};

    console.log('🔄 Fetching news from multiple sources...');

    // Fetch from all sources in parallel
    const [cryptoPanicArticles, newsApiArticles] = await Promise.all([
      this.fetchCryptoPanicNews(),
      this.fetchNewsAPINews(),
    ]);

    console.log(`📰 CryptoPanic: ${cryptoPanicArticles.length} articles`);
    console.log(`📰 NewsAPI: ${newsApiArticles.length} articles`);

    // Combine all articles
    let allArticles = [...cryptoPanicArticles, ...newsApiArticles];

    // Filter by categories
    allArticles = allArticles.filter((article) =>
      categories.includes(article.category)
    );

    // Filter by relevance score
    allArticles = allArticles.filter(
      (article) => (article.relevanceScore || 0) >= minRelevanceScore
    );

    // Deduplicate
    allArticles = this.deduplicateArticles(allArticles);

    // Sort by date (newest first) and relevance score
    allArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      const scoreA = a.relevanceScore || 0;
      const scoreB = b.relevanceScore || 0;

      // Prioritize relevance, then date
      if (Math.abs(scoreA - scoreB) > 0.2) {
        return scoreB - scoreA;
      }
      return dateB - dateA;
    });

    // Limit results
    allArticles = allArticles.slice(0, limit);

    console.log(`✅ Final: ${allArticles.length} unique, relevant articles`);

    return allArticles;
  }

  // Get categorized news
  async getCategorizedNews(limit = 50): Promise<{
    forex: NewsArticle[];
    crypto: NewsArticle[];
    financial: NewsArticle[];
    all: NewsArticle[];
  }> {
    const allArticles = await this.aggregateNews({ limit: limit * 3 });

    return {
      forex: allArticles.filter((a) => a.category === 'forex').slice(0, limit),
      crypto: allArticles.filter((a) => a.category === 'crypto').slice(0, limit),
      financial: allArticles.filter((a) => a.category === 'financial').slice(0, limit),
      all: allArticles.slice(0, limit),
    };
  }
}

// Singleton instance
let aggregatorInstance: MultiSourceNewsAggregator | null = null;

export function getNewsAggregator(): MultiSourceNewsAggregator {
  if (!aggregatorInstance) {
    const cpKey = process.env.CRYPTOPANIC_API_KEY || '';
    const newsApiKey = process.env.NEWSAPI_KEY || '';

    // At least one API key must be provided
    if (!cpKey && !newsApiKey) {
      throw new Error(
        'Missing API keys. Please set at least CRYPTOPANIC_API_KEY or NEWSAPI_KEY in environment variables.'
      );
    }

    aggregatorInstance = new MultiSourceNewsAggregator(cpKey, newsApiKey);
  }

  return aggregatorInstance;
}
