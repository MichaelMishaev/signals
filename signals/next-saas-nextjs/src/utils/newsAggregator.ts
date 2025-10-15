/**
 * News Aggregator - Fetches and categorizes news from multiple sources
 * Sources: Financial Modeling Prep (Forex/Crypto), CryptoPanic, NewsAPI
 */

import { INewsArticle } from '@/interface';

// Type definitions for API responses
interface FMPNewsItem {
  title: string;
  content?: string;
  snippet?: string;
  text?: string;
  url: string;
  publishedDate: string;
  site?: string;
  symbol?: string;
}

interface CryptoPanicNewsItem {
  title: string;
  url: string;
  published_at: string;
  source?: {
    title: string;
    domain: string;
  };
  currencies?: Array<{
    code: string;
    title: string;
  }>;
  votes?: {
    positive: number;
    negative: number;
    important: number;
  };
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

export interface AggregatedNewsArticle {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  category: 'Forex News' | 'Crypto News' | 'Market Analysis' | 'Trading Education';
  publishedDate: string;
  source: string;
  image?: string;
  featured?: boolean;
}

/**
 * Fetch Forex news from Financial Modeling Prep
 */
async function fetchForexNews(): Promise<AggregatedNewsArticle[]> {
  try {
    const apiKey = process.env.FMP_API_KEY;
    if (!apiKey) {
      console.warn('FMP_API_KEY not found, skipping forex news');
      return [];
    }

    const response = await fetch(
      `https://financialmodelingprep.com/api/v4/forex_news?page=0&limit=20&apikey=${apiKey}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      console.error('FMP Forex API error:', response.status);
      return [];
    }

    const data: FMPNewsItem[] = await response.json();

    return data.slice(0, 10).map((item, index) => ({
      id: `forex-fmp-${index}-${Date.now()}`,
      title: item.title,
      excerpt: item.text || item.snippet || item.content || 'No description available',
      url: item.url,
      category: 'Forex News' as const,
      publishedDate: item.publishedDate,
      source: item.site || 'Financial Modeling Prep',
      featured: index < 2, // First 2 are featured
    }));
  } catch (error) {
    console.error('Error fetching forex news:', error);
    return [];
  }
}

/**
 * Fetch Crypto news from Financial Modeling Prep
 */
async function fetchCryptoNewsFMP(): Promise<AggregatedNewsArticle[]> {
  try {
    const apiKey = process.env.FMP_API_KEY;
    if (!apiKey) {
      console.warn('FMP_API_KEY not found, skipping FMP crypto news');
      return [];
    }

    const response = await fetch(
      `https://financialmodelingprep.com/api/v4/crypto_news?page=0&limit=20&apikey=${apiKey}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      console.error('FMP Crypto API error:', response.status);
      return [];
    }

    const data: FMPNewsItem[] = await response.json();

    return data.slice(0, 10).map((item, index) => ({
      id: `crypto-fmp-${index}-${Date.now()}`,
      title: item.title,
      excerpt: item.text || item.snippet || item.content || 'No description available',
      url: item.url,
      category: 'Crypto News' as const,
      publishedDate: item.publishedDate,
      source: item.site || 'Financial Modeling Prep',
      featured: index < 2, // First 2 are featured
    }));
  } catch (error) {
    console.error('Error fetching FMP crypto news:', error);
    return [];
  }
}

/**
 * Fetch Crypto news from CryptoPanic
 */
async function fetchCryptoNewsCryptoPanic(): Promise<AggregatedNewsArticle[]> {
  try {
    const apiKey = process.env.CRYPTOPANIC_API_KEY;
    if (!apiKey) {
      console.warn('CRYPTOPANIC_API_KEY not found, skipping CryptoPanic news');
      return [];
    }

    const response = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${apiKey}&public=true&kind=news&filter=rising`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      console.error('CryptoPanic API error:', response.status);
      return [];
    }

    const data = await response.json();
    const results: CryptoPanicNewsItem[] = data.results || [];

    return results.slice(0, 15).map((item, index) => ({
      id: `crypto-panic-${index}-${Date.now()}`,
      title: item.title,
      excerpt: item.currencies?.map((c) => c.code).join(', ') || 'Crypto market news',
      url: item.url,
      category: 'Crypto News' as const,
      publishedDate: item.published_at,
      source: item.source?.title || 'CryptoPanic',
      featured: (item.votes?.important || 0) > 5, // Featured if marked important
    }));
  } catch (error) {
    console.error('Error fetching CryptoPanic news:', error);
    return [];
  }
}

/**
 * Fetch general financial news from NewsAPI
 */
async function fetchFinancialNewsAPI(): Promise<AggregatedNewsArticle[]> {
  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      console.warn('NEWSAPI_KEY not found, skipping NewsAPI');
      return [];
    }

    // Search for trading, forex, and market analysis keywords
    const keywords = 'trading OR forex OR cryptocurrency OR "market analysis" OR "technical analysis"';
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`,
      { next: { revalidate: 600 } } // Cache for 10 minutes
    );

    if (!response.ok) {
      console.error('NewsAPI error:', response.status);
      return [];
    }

    const data = await response.json();
    const articles: NewsAPIArticle[] = data.articles || [];

    return articles.slice(0, 15).map((item, index) => {
      // Categorize based on title/description content
      let category: AggregatedNewsArticle['category'] = 'Market Analysis';
      const text = `${item.title} ${item.description}`.toLowerCase();

      if (text.includes('forex') || text.includes('currency') || text.includes('eur/usd') || text.includes('gbp/usd')) {
        category = 'Forex News';
      } else if (text.includes('crypto') || text.includes('bitcoin') || text.includes('ethereum')) {
        category = 'Crypto News';
      } else if (text.includes('learn') || text.includes('guide') || text.includes('how to') || text.includes('tutorial')) {
        category = 'Trading Education';
      }

      return {
        id: `newsapi-${index}-${Date.now()}`,
        title: item.title,
        excerpt: item.description || 'No description available',
        url: item.url,
        category,
        publishedDate: item.publishedAt,
        source: item.source.name,
        image: item.urlToImage,
        featured: index < 3, // First 3 are featured
      };
    });
  } catch (error) {
    console.error('Error fetching NewsAPI:', error);
    return [];
  }
}

/**
 * Aggregate all news from multiple sources
 */
export async function aggregateAllNews(): Promise<AggregatedNewsArticle[]> {
  try {
    // Fetch from all sources in parallel
    const [forexNews, cryptoFMP, cryptoPanic, newsAPI] = await Promise.all([
      fetchForexNews(),
      fetchCryptoNewsFMP(),
      fetchCryptoNewsCryptoPanic(),
      fetchFinancialNewsAPI(),
    ]);

    // Combine all news
    const allNews = [...forexNews, ...cryptoFMP, ...cryptoPanic, ...newsAPI];

    // Sort by published date (newest first)
    allNews.sort((a, b) => {
      const dateA = new Date(a.publishedDate).getTime();
      const dateB = new Date(b.publishedDate).getTime();
      return dateB - dateA;
    });

    // Remove duplicates based on title similarity
    const uniqueNews = allNews.filter((article, index, self) => {
      return (
        index ===
        self.findIndex((t) => {
          // Simple duplicate check: same title (case insensitive)
          return t.title.toLowerCase() === article.title.toLowerCase();
        })
      );
    });

    console.log(`📰 Aggregated ${uniqueNews.length} unique articles from ${allNews.length} total`);
    console.log(`  - Forex: ${uniqueNews.filter((n) => n.category === 'Forex News').length}`);
    console.log(`  - Crypto: ${uniqueNews.filter((n) => n.category === 'Crypto News').length}`);
    console.log(`  - Market Analysis: ${uniqueNews.filter((n) => n.category === 'Market Analysis').length}`);
    console.log(`  - Trading Education: ${uniqueNews.filter((n) => n.category === 'Trading Education').length}`);

    return uniqueNews;
  } catch (error) {
    console.error('Error aggregating news:', error);
    return [];
  }
}

/**
 * Convert aggregated news to INewsArticle format
 */
export function convertToNewsArticle(aggregated: AggregatedNewsArticle): INewsArticle {
  return {
    id: aggregated.id,
    title: aggregated.title,
    excerpt: aggregated.excerpt,
    category: aggregated.category,
    author: aggregated.source,
    date: new Date(aggregated.publishedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    readTime: '3 min read', // Default read time
    featured: aggregated.featured || false,
    image: aggregated.image || '/images/news/default-news.jpg',
    slug: aggregated.id, // Use ID as slug since these are external articles
    content: aggregated.excerpt,
    tags: [aggregated.category.toLowerCase().replace(' ', '-')],
  };
}
